import { IObjectOperation, ISettings, IObjectOperationDictionary, Schema, IStrategy, LodashUtils } from "./interfaces";

export class ShaperStrategy implements IObjectOperation, IStrategy {
  private strategies: IObjectOperationDictionary
  private output: Object;
  private _: LodashUtils;

  constructor(_: LodashUtils) {
    this._ = _;
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
    let formatted = {};
    for (const resource of collection) {
      let shaped = resource;
      for (const classKey in this.strategies) {
        settings.current = key;
        shaped = this.strategies[classKey].operate(shaped, settings);
      }

      formatted[shaped[settings.uid]] = shaped;
    }

    this.output[key] = formatted;
  }

  isCollection(object: any, schema: any) {
    return object && Array.isArray(object) && this._.isPlainObject(schema);
  }

  operate(object: object, settings: ISettings): object {
    for (const key in settings.schema) {
      if (this.isCollection(object[key], settings.schema[key])) {
        this.format(object[key], key, settings);
      }

      this.output[key] = this.format(object[key], key, settings);
    }

    return this.output;
  }
}