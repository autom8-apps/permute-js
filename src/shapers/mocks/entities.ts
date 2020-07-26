import { SchemaType } from "../interfaces";

const Variant = {
  id: String,
  price: String,
  title: String,
  compareAtPrice: [String, null],
  available: Boolean,
  selectedOptions: Array,
}

const Product = {
    id: String,
    title: String,
    handle: String,
    availableForSale: Boolean,
    productType: String,
    onlineStoreUrl: String,
    images: [Object],
    variants: Variant,
    vendor: String,
}


export const VariantEntity = Variant as SchemaType;
export const ProductEntity = Product as SchemaType;