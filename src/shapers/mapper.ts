import { IObjectOperation, ISettings, LodashUtils, IMapperEntitySettings, IMapperSettings } from "./interfaces";
import { _ } from "./lodash-utils";

export class Mapper implements IObjectOperation {
  private _:LodashUtils;
  settings: ISettings;
  constructor() {
    this._ = _;
  }

  mapCollection(entityMap: IMapperEntitySettings, collection: any) {
    return collection.map((item: object) => this.mapEntity(entityMap, item));
  }

  mapKeys(entityMap: IMapperEntitySettings | IMapperSettings | string, entity: object) {
    const entityKeys = Object.keys(entityMap);
    const pickedProperties = this._.pick(entity, entityKeys);
    const formatted = {};

    for (const key in pickedProperties) {
      switch (true) {
        case this.isCollection(entityMap[key], entity[key]):
          formatted[this.getPropertyName(entityMap, key)] = this.mapCollection(entityMap[key], entity[key])
          break;
        case this.isEntity(entityMap[key], entity[key]):
          formatted[this.getPropertyName(entityMap, key)] = this.mapEntity(entityMap[key], entity[key]);
          break;
        default:
          formatted[entityMap[key]] = pickedProperties[key];
      }
    }

    return formatted;
  }

  mapEntity(entityMap: IMapperEntitySettings, entity: any): object|object[] {
    if (this.isCollection(entityMap, entity)) {
      return this.mapCollection(entityMap, entity)
    }

    return this.mapKeys(entityMap, entity);
  }

  isMappable(settings: ISettings, entity: object): boolean {
    return typeof settings === "object"
      && settings.map !== undefined
      && typeof settings.map === "object"
      && entity !== undefined;
  }

  isCollection(entityMap: IMapperEntitySettings, entity: object | object[]): boolean {
    return Array.isArray(entity)
      && typeof entity[0] === "object"
      && typeof entityMap === "object";
  }

  isEntity(entityMap: IMapperEntitySettings|string, entity: object | object[]) {
    return typeof entityMap === "object" && typeof entity === "object";
  }

  getPropertyName(entityMap: IMapperEntitySettings | IMapperSettings | string, key: string): string {
    return entityMap[key] && entityMap[key]._name || key;
  }

  format(entity: object): object|object[] {
    return this.mapEntity(this.settings.map, entity);
  }

  async operate(entity: object[], settings: ISettings): Promise<object|object[]> {
    try {
      return new Promise((resolve: (arg0: object | object[]) => void) => {
        if (!this.isMappable(settings, entity)) {
          throw new Error("Could not map properties to new object");
        }

        this.settings = settings;
        resolve(this.format(entity));
      });
    } catch (error) {
      console.error("Object Mapper: ", error);
    }
  }
}