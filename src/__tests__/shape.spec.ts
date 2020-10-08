// @ts-nocheck
import { productApiResponse, productCollection } from "../mocks/product";
import { isPlainObject } from "lodash";
import { Product, ProductWithMapper } from "../mocks/entities";
import { Shape } from "../index";

describe("StrategySingleton", () => {
  it("it should validate and reshape an object according to it's schema", async () => {
    const ProductModel = await Shape(productApiResponse, Product);
    expect(ProductModel.products).toBeDefined();
    expect(isPlainObject(ProductModel.products)).toBe(true);

    expect(ProductModel.variants).toBeDefined();
    expect(isPlainObject(ProductModel.variants)).toBe(true);

    expect(ProductModel.images).toBeDefined();
    expect(isPlainObject(ProductModel.images)).toBe(true);
  });

  it("it should validate and reshape an object according to it's schema", async () => {
    const ProductModel = await Shape(productCollection, Product);
    expect(ProductModel.products).toBeDefined();
    expect(Object.keys(ProductModel).length === 3).toBe(true);
    expect(isPlainObject(ProductModel.products)).toBe(true);

    expect(ProductModel.variants).toBeDefined();
    expect(isPlainObject(ProductModel.variants)).toBe(true);

    expect(ProductModel.images).toBeDefined();
    expect(isPlainObject(ProductModel.images)).toBe(true);
  });

  it("it should map before validating and reshaping an object according to it's schema", async () => {
    const ProductModel = await Shape(productCollection, ProductWithMapper);
    expect(ProductModel.products).toBeDefined();
    expect(Object.keys(ProductModel).length === 3).toBe(true);
    expect(isPlainObject(ProductModel.products)).toBe(true);

    expect(ProductModel.variants).toBeDefined();
    expect(isPlainObject(ProductModel.variants)).toBe(true);

    expect(ProductModel.images).toBeDefined();
    expect(isPlainObject(ProductModel.images)).toBe(true);
  });
});