import { Schema, ISettings } from "../interfaces";

const VariantSchema = {
  id: String,
  price: String,
  title: String,
  compareAtPrice: [String, null],
  available: Boolean,
  selectedOptions: Array,
} as Schema

const ProductSchema = {
    id: String,
    title: String,
    handle: String,
    availableForSale: Boolean,
    productType: String,
    onlineStoreUrl: String,
    images: [Object],
    variants: VariantSchema,
    vendor: String,
} as Schema

export const Product: ISettings = {
  uid: "id",
  childrenUid: "id",
  schema: ProductSchema,
  map: [
    {
      from: "availableForSale",
      to: "available",
    }
  ],
};

