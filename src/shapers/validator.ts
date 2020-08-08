import { IObjectOperation, ISettings, Schema, SchemaError, LodashUtils } from "./interfaces";
import { SchemaManager } from "./schema-manager";

export class Validator extends SchemaManager implements IObjectOperation {
  constructor(_: LodashUtils) {
    super(_);
  }

  operate(collection: object[], settings: ISettings): object {
    try {
      let errors: SchemaError;

      if (!this.isShapable(settings, collection)) return collection;

      if (this.isResource(collection, settings, settings.current)) {
        this.validate(collection, settings.schema, settings, errors);
      }

      if (this.isCollection(collection, settings.schema[settings.current])) {
        this.validate(collection[0], settings.schema, settings, errors);
      }

      if (errors && Object.keys(errors).length > 0) {
        throw new Error(errors.toString());
      }

      return collection;
    } catch (errors) {
      console.error("VALIDATION ERROR OCCURED.SEE REASON WHY BELOW:");
      console.table(this.buildErrorString(errors));
    }
  }

  buildErrorString(errors: FunctionConstructor[]): String|undefined {
    if (!errors) return;
    const incorrecttypes = (T: FunctionConstructor) => (`!= ${T.name}`);
    return `value: ${errors.map(incorrecttypes).join("or")}`;
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
    if (this.isOptional(type) && Array.isArray(type)) {
      return this.isValidMany(type, value);
    }

    return this.isOptional(type) || this.isObjectType(value, type)
  }

  buildError(key:string, type: FunctionConstructor): string {
    return this._.isObject(type)
      ? `${key} should be ${type.name}`
      : `${key} should be ${type}`;
  }

  isValidatorType(
    resource: object,
    schema: Schema | FunctionConstructor,
    settings: ISettings,
    key: string
  ): boolean {
    return (schema[key] &&
           resource[key] ||
           resource[key] &&
           schema[settings.current][key]) &&
           !Array.isArray(schema[key]);
  }

  validate(
    resource: object,
    schema: Schema | FunctionConstructor,
    settings: ISettings,
    errors: SchemaError
  ): SchemaError|undefined {
    const subject = this.findSchemaValue(resource, settings.current);

    if (!subject) return;

    for (const key in schema) {
      if (this.isCollection(schema[key], subject)) {
        this.validate(subject[0], schema[key], settings, errors);
      }

      if (this.isResource(resource[key], settings, key)) {
        this.validate(resource[key][0], schema[key], settings, errors);
      }

      if (
        this.isValidatorType(schema[key], resource[key], settings, key) &&
        !this.isValid(schema[key], resource[key])
      ) {
        errors[key] = this.buildError(key, schema[key]);
      }
    }

    return errors;
  }
}