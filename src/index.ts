const { omit, isObject, isPlainObject, once, hasIn, zipObject, pick, mapKeys, merge, flatMap } = require("lodash");
const { Validator, ReShaper, ShaperStrategy } = require("./shapers/index");
const { LodashUtils, ISettings, IStrategy } = require("./shapers/interfaces");
const _: typeof LodashUtils = Object.freeze({ omit, isObject, isPlainObject, hasIn, zipObject, pick, mapKeys, merge, flatMap });

const strategy = new ShaperStrategy(_);
strategy.setStrategy(new Validator(_));
strategy.setStrategy(new ReShaper(_));

function permute(data: object | object[], settings: typeof ISettings) {
  return strategy.operate(data, settings);
}

module.exports = permute;