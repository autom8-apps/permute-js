import * as _ from "lodash";
import { Cleaner } from "./index";
import { Product } from "./mocks/entities";

describe("Cleaner", () => {
  const cleaner = new Cleaner(_);
  it("should omit name from object props and keep title", () => {
    const object = {
      name: "jeb",
      title: "test"
    }
    // @ts-ignore
    expect(cleaner.operate(object, Product).name).toBeUndefined();
  });

});