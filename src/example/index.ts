
import { ProductEntity } from "../shapers/mocks/entities";
import { ISettings } from "../shapers/interfaces";
import { Shape } from "../index";

export const Product = (product: Object) => {
  let options: ISettings = {
    uid: "id",
    childrenUid: "id",
    schema: ProductEntity,
    map: [
      {
        from: "availableForSale",
        to: "available",
      }
    ],
  };

  return Shape(product, options);
}
