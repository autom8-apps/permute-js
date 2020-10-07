import { IObjectOperation, ISettings, LodashUtils, IMapperEntitySettings, IMapperSettings } from "./interfaces";
import { _ } from "./lodash-utils";

export class Mapper implements IObjectOperation {
  private _:LodashUtils;
  settings: ISettings;
  constructor() {
    this._ = _;
  }

  mapCollection(entityMap: IMapperEntitySettings, collection: any) {
    return collection.map((item: object) => this.map(entityMap, item));
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

  isEntity(entityMap: IMapperEntitySettings | string, entity: object | object[]) {
    return typeof entityMap === "object" && typeof entity === "object";
  }

  map(entityMap: IMapperEntitySettings | IMapperSettings | string, entity: object) {
    const entityKeys = Object.keys(entityMap);
    const pickedProperties = this._.pick(entity, entityKeys);
    const formatted = {};

    for (const key in pickedProperties) {
      if (this.isCollection(entityMap[key], entity[key])) {
        formatted[this.getPropertyName(key)] = this.mapCollection(entityMap[key], entity[key]);
      }

      if (this.isEntity(entityMap[key], entity[key])) {
        formatted[this.getPropertyName(key)] = this.map(entityMap[key], entity[key]);
      }

      formatted[entityMap[key].toString()] = pickedProperties[key];
    }

    return formatted;
  }

  getPropertyName(key: string): string {
    return this.settings.map[key] && this.settings.map[key]._name || key;
  }

  format(entity: object): object|object[] {
    const output = {};

    for (const key in entity) {
      output[this.getPropertyName(key)] = this.map(this.settings.map[key], entity[key]);
    }

    return output;
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