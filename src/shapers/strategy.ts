import { IObjectOperation, ISettings, IObjectOperationDictionary, IStrategy } from "./interfaces";
import { SchemaManager } from "./schema-manager";
import { _ } from "./lodash-utils";

enum STRATEGIES_STRINGS {
  Validator = "Validator",
  ReShaper = "ReShaper",
}

export class ShaperStrategy extends SchemaManager implements IObjectOperation, IStrategy {
  private strategies: IObjectOperationDictionary = {};

  constructor() {
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

  validateAndShape(resource: object|object[], settings: ISettings): object {
    let output = {};
    for (const key in settings.schema) {
      settings.current = key;
      if (!this.isShapable(settings, resource)) continue;
      this.getStrategy(STRATEGIES_STRINGS.Validator).operate(resource, settings);
      output = this._.merge(
        this.getStrategy(STRATEGIES_STRINGS.ReShaper).operate(resource, settings),
        output
      );
    }

    this.output = this._.merge(output, this.output);
    return this.output;
  }

  async operate(resource: object|object[], settings: ISettings): Promise<object> {
    try {
      return this.validateAndShape(resource, settings);
    } catch (errors) {
      return errors.split(",");
    }
  }
}