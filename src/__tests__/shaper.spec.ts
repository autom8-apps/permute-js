// @ts-nocheck
import { LodashUtils } from "../shapers/interfaces";
import { ReShaper } from "../shapers/reshaper";
import { productApiResponse, productCollection } from "../mocks/product";
import { Product as settings } from "../mocks/entities";
import { omit, isObject, isPlainObject, hasIn, zipObject, pick, mapKeys, merge } from "lodash";
const _: LodashUtils = Object.freeze({ omit, isObject, isPlainObject, hasIn, zipObject, pick, mapKeys, merge });

describe("Shaper", () => {
  let reshaper;

  beforeEach(() => {
    reshaper = new ReShaper(_);
  });

  afterEach(() => {
    settings.current = undefined;
  });


  it("Shaper.pickPlainObject() -- should remove props that are not set in schema", () => {
    const parsed = reshaper.pickPlainObject(productApiResponse, settings, "products");
    expect(parsed.createdAt).toBeUndefined();
    expect(parsed.id).toBeDefined();
  });

  it("Shaper.uids() -- should return an array of ids", () => {
    const ids = reshaper.uids(productCollection, settings, "products");
    expect(ids).toBeInstanceOf(Array);
    expect(ids.length > 0).toBe(true);
  });

  it("Shaper.uids() -- should throw an error if child resource doesnt have a uid", () => {
    expect(() => reshaper.uids(productCollection, settings, "error")).toThrowError();
  });


  it("Shaper.isCollection -- should return true if is array in data and is object in schema", () => {
    expect(reshaper.isCollection(productApiResponse.variants, settings.schema.variants)).toBe(true);
  });

  it("Shaper.childCollectionKeys -- should return true if property name equates to a collection and schema is an object schema", () => {
    const collectionKeys = reshaper.childCollectionKeys(productApiResponse, settings);
    expect(collectionKeys).toBeInstanceOf(Array);
    expect(collectionKeys.length > 0).toBe(true);
    expect(typeof collectionKeys[0]).toBe("string");
  });

  it("Shaper.isChildResource -- should return false if no parent is in schema", () => {
    settings.current = "variants";
    const isChildResource = reshaper.isChildResource(settings);
    expect(isChildResource).toBe(true);
    settings.current = "products";
    const productResource = reshaper.isChildResource(settings);
    expect(productResource).toBe(false);
  });
});