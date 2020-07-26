import { ISettings } from "../shapers/interfaces";
import { productApiResponse } from "../shapers/mocks/product";
import { clean } from "../index";

let settings: ISettings = {
  schema: {
    products: {
      id: String,
      title: String,
      handle: String,
      availableForSale: Boolean,
      productType: String,
      onlineStoreUrl: String,
      images: [Object],
      vendor: String,
      children: ["variants"],
    }
  }
};

export const ValidProduct = clean(productApiResponse, settings);

