import { omit, isObject, isPlainObject, once, hasIn } from "lodash";
import { Validator, Cleaner, ReShaper, ShaperStrategy } from "./shapers/index";
import { LodashUtils, IOperation, IStrategy } from "./shapers/interfaces";

const _: LodashUtils = Object.freeze({ omit, isObject, isPlainObject, hasIn });

const StrategySingleton = once(() => {
  const strategy: IStrategy = new ShaperStrategy(_);
  strategy.setStrategy(new Cleaner(_));
  strategy.setStrategy(new ReShaper(_));
  strategy.setStrategy(new Validator(_));
  return strategy;
});

export const shape: IOperation = StrategySingleton().operate;
export const validate: IOperation = StrategySingleton().getStrategy("Validator").operate;
export const reshape: IOperation = StrategySingleton().getStrategy("ReShaper").operate;
export const clean: IOperation = StrategySingleton().getStrategy("Cleaner").operate;
