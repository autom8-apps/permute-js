import { ISettings } from "../shapers/interfaces";
import { productApiResponse } from "../mocks/product";
import { shape } from "../index";

let settings: ISettings = {
  schema: {
    products: {
      _uid: "id",
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
      _uid: "id",
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

