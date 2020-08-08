import { omit, isObject, isPlainObject, once, hasIn, zipObject, pick, mapKeys, merge, flatMap } from "lodash";
import { Validator, ReShaper, ShaperStrategy } from "./shapers/index";
import { LodashUtils, IOperation, IStrategy } from "./shapers/interfaces";

const _: LodashUtils = Object.freeze({ omit, isObject, isPlainObject, hasIn, zipObject, pick, mapKeys, merge, flatMap });

const StrategySingleton = once(() => {
  const strategy: IStrategy = new ShaperStrategy(_);
  strategy.setStrategy(new Validator(_));
  strategy.setStrategy(new ReShaper(_));
  return strategy;
});

export const shape: IOperation = StrategySingleton().operate;
export const validate: IOperation = StrategySingleton().getStrategy("Validator").operate;
export const reshape: IOperation = StrategySingleton().getStrategy("ReShaper").operate;
