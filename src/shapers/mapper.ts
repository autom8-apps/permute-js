/**
 * @todo create mapper shaper strategy that handle renaming of object propertyies for single object and collections
 */
import { IObjectOperation, ISettings, LodashUtils, ISettingsMapper } from "./interfaces";

export class Mapper implements IObjectOperation {
  output: object | object[];
  private _:LodashUtils;
  private settings: ISettings;
  constructor(_: LodashUtils) {
    this._ = _;
  }

  mapCollection(entityMap: ISettingsMapper, collection: any) {
    const mapProps = (item: object) => this.mapSingleEntity(entityMap, item);
    return collection.map(mapProps);
  }

  mapKeys(entityMap: ISettingsMapper, entity: object) {
    const formatted = {};
    for (const key in entity) {
      formatted[this.settings.map[key]] = entity[key];
    }
  }

  mapSingleEntity(entityMap: ISettingsMapper, entity: object|object[]) {
    return this.isCollection(entityMap, entity)
      ? this.mapCollection(entityMap, entity)
      : this.mapKeys(entityMap, entity);
  }

  isMappable(data ?: object): boolean {
    return this.settings
      && this.settings.map !== undefined
      && typeof this.settings.map === "object"
      && data !== undefined;
  }

  isCollection(entityMap: ISettingsMapper, data: object | object[]): boolean {
    return Array.isArray(data) && typeof entityMap === "object";
  }

  mapProps(entityMap: ISettingsMapperComplex|ISettingsMapper, entity: object|object[]) {
    return this.isCollection(entityMap, entity)
      ? this.mapCollection(entityMap, entity)
      : this.mapSingleEntity(entityMap, entity);
  }

  format(data: object): object|object[] {
    const output = {};
    for (const key in this.settings.map) {
      output[key] = this.mapProps(this.settings.map[key], data[key]);
    }

    return output;
  }

  operate(data: object[], settings: ISettings): object|object[] {
    try {
      this.settings = settings;
      if (!this.isMappable()) throw new Error("Could not map properties to new object");
      return this.format(data);
    } catch (error) {
      console.error("Object Mapper", error);
    }
  }
}