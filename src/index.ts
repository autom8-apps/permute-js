import * as _ from "lodash";
import { Validator, Cleaner, ReShaper, ShaperStrategy } from "./shapers/index";

export const Shape = _.once(() => {
  const strategy = new ShaperStrategy();
  strategy.setStrategy(new Cleaner(_));
  strategy.setStrategy(new ReShaper());
  strategy.setStrategy(new Validator(_));
});