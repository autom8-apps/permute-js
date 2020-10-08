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
  selectedOptions: [Object],
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
    images: [String],
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

export const ProductWithMapper: ISettings = {
  map: {
    products: {
      id: "id",
      title: "title",
      handle: "handle",
      availableForSale: "availableForSale",
      productType: "productType",
      onlineStoreUrl: "onlineStoreUrl",
      images: {
        _name: "images",
        id: "id",
        src: "src",
        altText: "altText",
      },
      vendor: "images",
      variants: {
        id: "id",
        price: "price",
        title: "title",
        compareAtPrice: "compareAtPrice",
        available: "available",
        selectedOptions: "selectedOptions",
      },
    }
  },
  schema: {
    products: ProductSchema,
    variants: VariantSchema,
    images: ProductImageSchema
  },
};

