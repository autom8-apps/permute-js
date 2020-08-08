// @ts-nocheck
import { Validator } from "../shapers/validator";
import { LodashUtils } from "../shapers/interfaces";
import { productApiResponse, productCollection } from "../mocks/product";
import { Product as settings } from "../mocks/entities";
import { omit, isObject, isPlainObject, hasIn, zipObject, pick, mapKeys, merge } from "lodash";
const _: LodashUtils = Object.freeze({ omit, isObject, isPlainObject, hasIn, zipObject, pick, mapKeys, merge });

describe("Shaper", () => {
  let validator = new Validator(_);

  afterEach(() => {
    settings.current = undefined;
  });

  describe("isOptionalWithValue", () => {
    it("returns true if type is an array that contains a Data Type Constructor and also a null value", () => {
      expect(false).toBe(true)
    });
  });

  describe("isObjectType", () => {
    it("returns true if value is an array and first type is a Data Type Constructor ", () => {
      expect(validator.isObjectType({}, Object)).toBe(true)
    });
  });

  describe("isType", () => {
    it("returns true if type is equal to the schema type Data Type Constructor", () => {
      expect(validator.isType("string", String)).toBe(true);
      expect(validator.isType("string", Object)).toBe(false);

      expect(validator.isType(1, Number)).toBe(true);
      expect(validator.isType(1, String)).toBe(false);

      expect(validator.isType({}, Object)).toBe(true);
      expect(validator.isType({}, Array)).toBe(false);

      expect(validator.isType([], Array)).toBe(true);
      expect(validator.isType([], Object)).toBe(false);
    });
  });
});