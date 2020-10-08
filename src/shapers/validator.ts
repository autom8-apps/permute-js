import { IObjectOperation, ISettings, Schema, LodashUtils, SchemaType } from "./interfaces";
import { SchemaManager } from "./schema-manager";
import { _ } from "./lodash-utils";

export class Validator extends SchemaManager implements IObjectOperation {
  constructor() {
    super(_);
  }

  async operate(data: any, settings: ISettings): Promise<object> {
    try {
      return new Promise(resolve => {
        let errors: string[] = [];

        if (!this.isShapable(settings, data)) return data;

        const first = Object.keys(settings.schema)[0];
        this.validate(data, settings.schema[first], settings, errors);

        if (errors && Object.keys(errors).length > 0) {
          throw new Error(errors.join(","));
        }

        resolve(data);
      })
    } catch (errors) {
      console.error("Permute.js - VALIDATION ERROR OCCURED: ");
      console.table(
        errors.message.includes(",")
          ? errors.split(",")
          : [errors.message]);
    }
  }

  isOptionalWithValue(type: FunctionConstructor | null, value: any) {
    return Array.isArray(type)
      && this._.isObject(type[0])
      && this.isObjectType(value, type);
  }

  isOptional(type: FunctionConstructor|null) {
    return !this._.isObject(type) || (Array.isArray(type) && type.includes(null));
  }

  isType(value: any, type: FunctionConstructor) {
    return type.name === new Object(value).constructor.name
  }

  isObjectType(value: any, type: FunctionConstructor) {
    return (Array.isArray(type) && this.isType(value, type[0])) || this.isType(value, type);
  }

  isValidMany(type: FunctionConstructor[], value: any): boolean {
    for (const dataType of type) {
      if (this.isObjectType(value, dataType)) {
        return true;
      }
    }

    return false;
  }

  isValid(type: FunctionConstructor|null, value: any): boolean {
    if (!this.isOptional(type) && Array.isArray(type)) {
      return this.isValidMany(type, value);
    }

    return this.isOptional(type) || this.isObjectType(value, type)
  }

  buildError(key:string, type: SchemaType): string {
    return `${key} should be ${type.name}`;
  }

  isLibraryAdded(key: string) {
    return ["_uid"].includes(key);
  }

  validate(
    resource: object,
    schema: object,
    settings: ISettings,
    errors: string[]
  ): string[]|undefined {
    for (const key in schema) {
      let subject = this.findSchemaValue(resource, key);

      switch (true) {
        case !subject || this.isLibraryAdded(key):
          break;
        case this.isResource(subject, settings, key):
          this.validate(subject, { ...settings.schema[key] }, settings, errors);
          break;
        case !this.isValid(schema[key], subject):
          errors.push(this.buildError(key, schema[key]));
          break;
      }
    }

    if (errors.length > 0) return errors;
  }
}