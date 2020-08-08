import { IObjectOperation, ISettings, Schema, SchemaError, LodashUtils } from "./interfaces";
import { Shaper } from "./shaper";

export class Validator extends Shaper implements IObjectOperation {
  constructor(_: LodashUtils) {
    super(_);
  }

  operate(resource: object[], { schema }: ISettings): object {
    try {
      let errors: SchemaError;
      this.validate(resource, schema, errors);

      if (errors && Object.keys(errors).length > 0) {
        throw new Error(errors.toString());
      }

      return resource;
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
    return !this._.isObject(type) || (Array.isArray(type) && type.includes(null)) || ;
  }

  isType(value: any, type: FunctionConstructor) {
    return type.name === new Object(value).constructor.name
  }

  isObjectType(value: any, type: FunctionConstructor) {
    return (Array.isArray(value) && this.isType(value[1], type)) || this.isType(value, type);
  }

  isLibraryAdded(key: string) {
    return key === "hasMany" || key === "belongsTo";
  }

  isValid(type: FunctionConstructor|null, value: any, key ?: string) {
    return this.isOptional(type)
      || this.isObjectType(value, type)
      || (key && this.isLibraryAdded(key));
  }

  isChild(type: any, subject: any) : boolean {
    return this._.isPlainObject(type) && this.isCollection(subject, type);
  }

  buildError(key:string, type: FunctionConstructor): string {
    return this._.isObject(type)
      ? `${key} should be ${type.name}`
      : `${key} should be ${type}`;
  }

  isResource(type: any, subject: any): boolean {
    return this._.isPlainObject(type) && this._.isPlainObject(subject);
  }

  validate(resource: any, schema: Schema | FunctionConstructor, errors: SchemaError): SchemaError|undefined {
    for (const key in resource) {
      if (this.isResource(schema[key], resource[key])) this.validate(resource[key], schema[key], errors);
      if (this.isChild(schema[key], resource[key])) this.validate(resource[key][0], schema[key], errors);
      if (!this.isValid(schema[key], resource[key], key)) {
        errors[key] = this.buildError(key, schema[key]);
      }
    }

    return errors;
  }
}