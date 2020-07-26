import * as _ from "lodash";
import { ISettings, IObjectOperation, LodashUtils, Schema } from "./interfaces";

export class Cleaner implements IObjectOperation {
  private readonly _: LodashUtils;

  constructor(_: LodashUtils) {
    this._ = _;
  }

  operate(object: object, { schema }: ISettings): object {
    return this._.omit(object, Object.keys(schema));
  }
}
