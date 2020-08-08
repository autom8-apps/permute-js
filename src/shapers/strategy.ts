import { IObjectOperation, ISettings, IObjectOperationDictionary, IStrategy, LodashUtils } from "./interfaces";
import { SchemaManager } from "./schema-manager";

/**
 * A property that is already an object and not a collection at the root level is assumed
 * to be already normalized therefore no operation is taken.
 */

export class ShaperStrategy extends SchemaManager implements IObjectOperation, IStrategy {
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
    let output = {};
    for (const classKey in this.strategies) {
      settings.current = key;
      output = this.strategies[classKey].operate(
        collection,
        settings
      );
    }

    this.output = this._.merge(output, this.output);
  }

  operate(object: object, settings: ISettings): object {
    for (const key in object) {
      this.format(object[key], key, settings);
    }

    return this.output;
  }
}