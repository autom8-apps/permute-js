import { SchemaType, ISettings } from "../shapers/interfaces";

const ProductImageSchema = {
  _uid: "id",
  id: String,
  src: String,
  altText: String,
  products: String,
}

const VariantSchema = {
  _uid: "id",
  id: String,
  price: String,
  title: String,
  compareAtPrice: [String, null],
  available: Boolean,
  selectedOptions: Array,
  products: String,
} as SchemaType

const ProductSchema = {
    _uid: "id",
    id: String,
    title: String,
    handle: String,
    availableForSale: Boolean,
    productType: String,
    onlineStoreUrl: String,
    images: [Object],
    vendor: String,
    variants: [String],
} as SchemaType

export const Product: ISettings = {
  schema: {
    products: ProductSchema,
    variants: VariantSchema,
    images: ProductImageSchema
  },
};

