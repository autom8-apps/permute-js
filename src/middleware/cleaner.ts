import * as _ from "lodash";
import { LoDashStatic } from "lodash";
import { SchemaType, IObjectOperation } from "./interfaces";

export class Cleaner implements IObjectOperation {
  private readonly _: LoDashStatic;
  private object: Object = {};
  private schema: SchemaType;

  constructor(_: LoDashStatic) {
    this._ = _;
  }

  operate(): {} {
    return this._.omit(this.object, Object.keys(this.schema));
  }
}
