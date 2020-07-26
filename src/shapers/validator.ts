// @ts-check
import { IObjectOperation, ISettings, SchemaType, SchemaError } from "./interfaces";
import { LoDashStatic } from "lodash";

export class Validator implements IObjectOperation {
  private readonly _: LoDashStatic;

  constructor(_: LoDashStatic) {
    this._ = _;
  }

  operate(object: object, { schema }: ISettings): Object {
    try {
      const errors: SchemaError|{} = this.validate(object, schema);

      if (Object.keys(errors).length > 0) {
        throw new Error(errors.toString());
      }

      return object;
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

  isObjectType(value: any, type: FunctionConstructor) {
    return type.name === new Object(value).constructor.name;
  }

  isValid(type: FunctionConstructor|null, value: string) {
    return this.isOptional(type) || this.isObjectType(value, type)
  }

  isCollection(subject: any) {
    return (Array.isArray(subject) && this._.isPlainObject(subject[0]));
  }

  isChild(type: any, subject: any) : boolean {
    return this._.isPlainObject(type) && this.isCollection(subject);
  }

  buildError(key:string, type: FunctionConstructor): string {
    return this._.isObject(type)
      ? `${key} should be ${type.name}`
      : `${key} should be ${type}`;
  }

  /**
   * some people might see this and think, "you're not validating every object"
   *
   * If you're working with an array of object that aren't all the same types and aren't
   * all the same shape for that type, you've got bigger problems on your hands.
   *
   * @param object
   * @param schema
   */
  validate(object: object, schema: SchemaType|FunctionConstructor): SchemaError|{} {
    const errors: SchemaError = {};
    for (const key in schema) {
      if (this.isChild(schema[key], object[key])) {
        this.validate(object[key][0], schema[key]);
      }

      if (!this.isValid(schema[key], object[key])) {
        errors[key] = this.buildError(key, schema[key]);
      }
    }

    return errors;
  }
}