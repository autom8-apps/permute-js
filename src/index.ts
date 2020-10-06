import { Validator, ReShaper, ShaperStrategy, Mapper } from "./shapers/index";
import { ISettings, IStrategy } from "./shapers/interfaces";

const strategy: IStrategy = new ShaperStrategy();
strategy.setStrategy(new Validator());
strategy.setStrategy(new ReShaper());
strategy.setStrategy(new Mapper());

async function Shape(data: object | object[], settings: ISettings) {
  return await strategy.operate(data, settings);
}

module.exports = {
  Shape,
  Validator,
  ReShaper,
  Mapper
};