import * as _ from "lodash";
import { LoDashStatic } from "lodash";
import { ISettings, IObjectOperation } from "./interfaces";

export class Cleaner implements IObjectOperation {
  private readonly _: LoDashStatic;

  constructor(_: LoDashStatic) {
    this._ = _;
  }

  operate(object: object, { schema }: ISettings): {} {
    return this._.omit(object, Object.keys(schema));
  }
}
