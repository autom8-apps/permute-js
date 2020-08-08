// @ts-nocheck
import { LodashUtils } from "../shapers/interfaces";
import { ReShaper } from "../shapers/reshaper";
import { productApiResponse, productCollection } from "../mocks/product";
import { Product as settings } from "../mocks/entities";
import { omit, isObject, isPlainObject, hasIn, zipObject, pick, mapKeys, merge } from "lodash";
const _: LodashUtils = Object.freeze({ omit, isObject, isPlainObject, hasIn, zipObject, pick, mapKeys, merge });

describe("SchemaManager", () => {
  let reshaper;

  beforeEach(() => {
    reshaper = new ReShaper(_);
  });

  afterEach(() => {
    settings.current = undefined;
  });


  it("pickPlainObject() -- should remove props that are not set in schema", () => {
    const parsed = reshaper.pickPlainObject(productApiResponse, settings, "products");
    expect(parsed.createdAt).toBeUndefined();
    expect(parsed.id).toBeDefined();
  });

  it("uids() -- should return an array of ids", () => {
    const ids = reshaper.uids(productCollection, settings, "products");
    expect(ids).toBeInstanceOf(Array);
    expect(ids.length > 0).toBe(true);
  });

  it("uids() -- should throw an error if child resource doesnt have a uid", () => {
    expect(() => reshaper.uids(productCollection, settings, "error")).toThrowError();
  });


  it("isCollection -- should return true if is array in data and is object in schema", () => {
    expect(reshaper.isCollection(productApiResponse.variants, settings.schema.variants)).toBe(true);
  });

  it("childCollectionKeys -- should return true if property name equates to a collection and schema is an object schema", () => {
    const collectionKeys = reshaper.childCollectionKeys(productApiResponse, settings);
    expect(collectionKeys).toBeInstanceOf(Array);
    expect(collectionKeys.length > 0).toBe(true);
    expect(typeof collectionKeys[0]).toBe("string");
  });

  it("isResource -- should return true if schema is plain object and current subject is plain object", () => {
    expect(reshaper.isResource(productApiResponse, settings, "products")).toBe(true);
  });

  it("isResource -- should return false if schema is NOT plain object and current subject is plain object", () => {
    settings.schema.bar = "foo";
    expect(reshaper.isResource(productApiResponse, settings, "bar")).toBe(false);
  });

  it("isResource -- should return false if schema is plain object and current subject is NOT plain object", () => {
    settings.schema.bar = "products";
    expect(reshaper.isResource("joe", settings, "bar")).toBe(false);
  });

  it("isChildResource -- should return false if no parent is in schema", () => {
    settings.current = "variants";
    const isChildResource = reshaper.isChildResource(settings);
    expect(isChildResource).toBe(true);
    settings.current = "products";
    const productResource = reshaper.isChildResource(settings);
    expect(productResource).toBe(false);
  });

  it("findSchemaValue -- should return top level value if found", () => {
    expect(reshaper.findSchemaValue({ products: productApiResponse }, "products")).toBeDefined();
  });

  it("findSchemaValue -- should return nested value if found", () => {
    expect(reshaper.findSchemaValue({ products: productApiResponse }, "variants")).toBeDefined();
  });
});