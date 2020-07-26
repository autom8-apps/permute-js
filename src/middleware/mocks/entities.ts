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
    images: Array,
    variants: [Variant],
    vendor: String,
}


export const VariantEntity = new Object(Variant) as SchemaType;
export const ProductEntity = new Object(Product) as SchemaType;