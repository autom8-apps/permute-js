
import { ProductEntity } from "../operations/mocks/entities";
import { Shape } from "../operations/index";

export var Product = async (product: Object) => {
  let options = Object.freeze({
    unformatted: product,
    type: ProductEntity,
    settings: {
      validate: true,
      clean: true,
    },
  });

  return await Shape(options);
}
