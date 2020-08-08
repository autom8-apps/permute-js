import { LodashUtils, ISettings, Schema } from "./interfaces";
import { indexOf } from "lodash";

export abstract class SchemaManager {
  protected output: object;
  protected readonly _: LodashUtils;

  constructor(_: LodashUtils) {
    this._ = _;
  }

  isFirstSchemaType(key: string, schema: object): boolean {
    return Object.keys(schema).indexOf(key) === 1;
  }

  childCollectionKeys(resource: object, settings: ISettings): string[] {
    return Object.keys(resource).filter((i) =>
      this.isCollection(resource[i], settings.schema[i])
    );
  }

  isChildResource(settings: ISettings) {
    return this._.isPlainObject(settings.schema[settings.current]) && Object.keys(settings.schema).find(key => {
      const childProp = settings.schema[key][settings.current];
      return childProp && Array.isArray(childProp) && childProp.length && childProp[0].name === "String"
    }) !== undefined;
  }

  getResource(resource: any) {
    if (Array.isArray(resource)) {
      return resource[0];
    }

    return resource;
  }

  findSchemaValue(resource: Object, currentSchemaKey: string): object|FunctionConstructor|null {
    for (const key of Object.keys(resource)) {
      if (resource[currentSchemaKey]) {
        return this.getResource(resource[currentSchemaKey]);
      }

      if (this._.isObject(resource[key]) && resource[key][currentSchemaKey]) {
        return this.getResource(resource[key][currentSchemaKey]);
      }
    }
  }

  isResource(resource: any, settings: ISettings, schemaName: string) {
    return this._.isPlainObject(resource) && this._.isPlainObject(settings.schema[schemaName])
  }

  isShapable(settings: ISettings, data: object|object[]) {
    data = Array.isArray(data) ? data : [data];
    const collection = this.isCollection(data, settings.schema[settings.current]);
    const child = this.isChildResource(settings);

    return collection && !child;
  }

  isCollection(resource: object|object[], type: any): boolean {
    return resource && Array.isArray(resource) && this._.isPlainObject(type);
  }

  uids(collection: object[], settings: ISettings, name: string) {
    if (!settings.schema[name] || !settings.schema[name]._uid) throw new Error("All entities should specify _uid");
    if (this._.isPlainObject(collection)) {
      return collection[settings.schema[name]._uid].toString()
    }
    return collection.map((r) => {
      return r[settings.schema[name]._uid].toString()
    });
  }

  pickPlainObject(resource: object, settings: ISettings, schemaName: string): object {
    return this._.pick(
      resource,
      Object.keys(settings.schema[schemaName])
    );
  }
}