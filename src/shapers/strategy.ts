import { IObjectOperation, ISettings, IObjectOperationDictionary, IModelDictionary, IStrategy } from "./interfaces";
import * as _ from "lodash";

export class ShaperStrategy implements IObjectOperation, IStrategy {
  private strategies: IObjectOperationDictionary
  private output: Object;

  setStrategy(Strategy: IObjectOperation) {
    this.strategies[Strategy.constructor.name] = Strategy;
  }

  removeStrategy(classKey: string) {
    delete this.strategies[classKey];
  }

  operate(object: object, settings: ISettings): Object {
    for (const key in this.strategies) {
      this.output = this.strategies[key].operate(object, settings);
    }

    return this.output;
  }
}