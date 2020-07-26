import { ISettings } from "../shapers/interfaces";
import { productApiResponse } from "../shapers/mocks/product";
import { shape } from "../index";

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
    },
    variants: {
      id: String,
      price: String,
      title: String,
      compareAtPrice: [String, null],
      available: Boolean,
      selectedOptions: Array,
    }
  }
};

export const ProductModel = shape(productApiResponse, settings);

