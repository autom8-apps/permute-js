import { IObjectOperation, ISettings, IObjectOperationDictionary, IStrategy, LodashUtils } from "./interfaces";
import { Shaper } from "./shaper";

export class ShaperStrategy extends Shaper implements IObjectOperation, IStrategy {
  private strategies: IObjectOperationDictionary

  constructor(_: LodashUtils) {
    super(_);
  }

  setStrategy(Strategy: IObjectOperation) {
    this.strategies[Strategy.constructor.name] = Strategy;
  }

  removeStrategy(classKey: string) {
    delete this.strategies[classKey];
  }

  getStrategy(classKey: string) {
    return this.strategies[classKey];
  }

  format(collection: object[], key: string, settings: ISettings): void {
    for (const classKey in this.strategies) {
      settings.current = key;
      this.output = this.strategies[classKey].operate(
        collection,
        settings
      );
    }
  }

  operate(object: object, settings: ISettings): object {
    for (const key in object) {
      this.format(object[key], key, settings);
    }

    return this.output;
  }
}