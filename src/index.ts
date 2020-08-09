import { omit, isObject, isPlainObject, once, hasIn, zipObject, pick, mapKeys, merge, flatMap } from "lodash";
import { Validator, ReShaper, ShaperStrategy } from "./shapers/index";
import { LodashUtils, ISettings, IStrategy } from "./shapers/interfaces";
const _: LodashUtils = Object.freeze({ omit, isObject, isPlainObject, hasIn, zipObject, pick, mapKeys, merge, flatMap });

const strategy = new ShaperStrategy(_);
strategy.setStrategy(new Validator(_));
strategy.setStrategy(new ReShaper(_));

function permute(data: object | object[], settings: ISettings) {
  return strategy.operate(data, settings);
}

module.exports = permute;