const { Validator, ReShaper, ShaperStrategy, Mapper } = require("./shapers/index");
const { ISettings, IStrategy } = require("./shapers/interfaces");

const strategy = new ShaperStrategy();
strategy.setStrategy(new Validator());
strategy.setStrategy(new ReShaper());
strategy.setStrategy(new Mapper());

function Shape(data: object | object[], settings: typeof ISettings) {
  return strategy.operate(data, settings);
}

module.exports = {
  Shape,
  Validator,
  ReShaper,
  Mapper
};