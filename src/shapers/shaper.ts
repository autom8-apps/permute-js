import { LodashUtils, ISettings } from "./interfaces";

export abstract class Shaper {
  protected output: object;
  protected readonly _: LodashUtils;

  constructor(_: LodashUtils) {
    this._ = _;
  }

  childCollectionKeys(resource: object, settings: ISettings): string[] {
    return Object.keys(resource).filter((i) =>
      this.isCollection(resource[i], settings.schema[i])
    );
  }

  isChildResource(settings: ISettings) {
    return this._.isPlainObject(settings.schema[settings.current]) &&
      Object.keys(settings.schema).filter((key) => {
      return Object.keys(settings.schema).find(k => {
        return settings.schema[k][settings.current] &&
          Array.isArray(settings.schema[k][settings.current])
          && Object.is(settings.schema[settings.current][key], String);
      })
    }).length > 0;
  }

  isResource(resource: any, settings: ISettings, schemaName: string) {
    return this._.isPlainObject(resource) && this._.isPlainObject(settings.schema[schemaName])
  }

  isShapable(settings: ISettings, data: object[]) {
    return this.isCollection(data, settings.schema[settings.current]) ||
      (this._.isPlainObject(data) && this._.isPlainObject(settings.schema[settings.current]))
      && !this.isChildResource(settings);
  }

  isCollection(resource: object[], type: any): boolean {
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