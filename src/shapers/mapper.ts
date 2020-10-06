import { IObjectOperation, ISettings, LodashUtils, IMapperEntitySettings } from "./interfaces";
import { _ } from "./lodash-utils";

export class Mapper implements IObjectOperation {
  private _:LodashUtils;
  settings: ISettings;
  constructor() {
    this._ = _;
  }

  mapCollection(entityMap: IMapperEntitySettings, collection: any) {
    const mapProps = (item: object) => this.mapSingleEntity(entityMap, item);
    return collection.map(mapProps);
  }

  mapKeys(entityMap: IMapperEntitySettings, entity: object) {
    const entityKeys = Object.keys(entityMap);
    const pickedProperties = this._.pick(entity, entityKeys);
    const formatted = this._.omit(entity, entityKeys);

    for (const key in pickedProperties) {
      if (typeof entityMap[key] !== "object") {
        formatted[entityMap[key].toString()] = pickedProperties[key];
      }
    }

    return formatted;
  }

  mapSingleEntity(entityMap: IMapperEntitySettings, entity: object|object[]) {
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
    return Array.isArray(entity) && typeof entityMap === "object";
  }

  mapProps(entityMap: IMapperEntitySettings, entity: object | object[]) {
    if (this.isCollection(entityMap, entity)) {
      this.mapCollection(entityMap, entity)
    }

    return this.mapSingleEntity(entityMap, entity);
  }

  format(entity: object): object|object[] {
    const output = {};

    for (const key in this.settings.map) {
      output[key] = this.mapProps(this.settings.map[key], entity[key]);
    }

    return output;
  }

  async operate(entity: object[], settings: ISettings): Promise<object|object[]> {
    try {
      return new Promise(resolve => {
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