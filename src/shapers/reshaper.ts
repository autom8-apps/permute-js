import { IObjectOperation, ISettings, LodashUtils, SchemaType, IModelDictionary } from "./interfaces";
import { SchemaManager } from "./schema-manager";

export class ReShaper extends SchemaManager implements IObjectOperation {
  constructor(_: LodashUtils) {
    super(_);
  }

  hasMany(children: string[], item: any, output: object, settings: ISettings): object {
    if (!children || children === null) return output;
    for (const child of children) {
      if (item[child]) {
        output[child] = this.uids(item[child], settings, child);
      }
    }

    return output;
  }

  belongsTo(parentId: string | number, output: object, settings: ISettings): object {
    if (parentId) {
      output[settings.current] = parentId;
    }

    return output;
  }

  normalize(
    item: object,
    settings: ISettings,
    schemaName: string,
    children: string[],
    parentId?: string | number
  ) {
    let cleaned = item;
    cleaned = this.hasMany(children, item, cleaned, settings);
    cleaned = this._.pick(cleaned, Object.keys(settings.schema[schemaName]));
    cleaned = this.belongsTo(parentId, cleaned, settings)
    return cleaned;
  }

  shape(item: object, settings: ISettings, children: string[], schemaName: string, parentId ?: string|number): object {
    if (children && children.length > 0) {
      return this.normalize(
        item,
        settings,
        schemaName,
        children
      )
    }

    return this.normalize(
      item,
      settings,
      schemaName,
      null,
      parentId,
    )
  }

  toDictionary(
    collection: object[],
    settings: ISettings,
    schemaName: string,
    children?: string[],
    parentId?: string|number,
  ): IModelDictionary {
    const shaped = this._.zipObject(
      this.uids(collection, settings, schemaName),
      collection.map(
        (item) => this.shape(item, settings, children, schemaName, parentId)
      )
    );
    return shaped;
  }

  shapeChild(collection: object[], childKey: string, settings: ISettings): object[] {
    return this._.flatMap(collection, (resource: object) => {
      resource[childKey] = resource[childKey].map((child: any) => this.shape(
        child,
        settings,
        null,
        childKey,
        resource[settings.schema[settings.current]._uid].toString()
      ));

      return resource[childKey]
    });
  }

  reduceChildResources(collection: object[], settings: ISettings, childKeys: string[]) {
    return childKeys.reduce((output, key) => {
      const shaped = this.shapeChild(collection, key, settings);
      const keys = shaped.map((c) => c[settings.schema[key]._uid].toString())
      output[key.toString()] = this._.zipObject(
        keys,
        shaped
      )
      return output;
    },
    {});
  }

  format(collection: object[], settings: ISettings): IModelDictionary {
    const adjustedForPlainObject = Array.isArray(collection) ? collection : [collection];
    let dictionary: any = {};
    const childKeys = this.childCollectionKeys(collection[0], settings);

    if (childKeys.length > 0) {
      dictionary = this._.merge(
        this.reduceChildResources(
          adjustedForPlainObject,
          settings,
          childKeys
        ),
        dictionary
      );
    }

    dictionary[settings.current] = this.isResource(collection, settings, settings.current)
      ? this.pickPlainObject(collection, settings, settings.current)
      : this.toDictionary(collection, settings, settings.current, childKeys);

    return dictionary;
  }

  operate(data: object[], settings: ISettings): object | IModelDictionary {
    try {
      if (!this.isShapable(settings, data)) return data;
      return this.format(data, settings);
    } catch (error) {
      console.error("Object Shaper", error);
    }
  }
}