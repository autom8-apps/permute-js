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
    validator = new Validator(_);
  });

  describe("isOptionalWithValue", () => {
    it("returns true if type is an array that contains a Data Type Constructor and also a null value", () => {
      expect(validator.isOptionalWithValue([String, Number, null], "string")).toBe(true)
    });

    it("returns false if type is an array that contains a Data Type Constructor and not a null value", () => {
      expect(validator.isOptionalWithValue([String, Array], {})).toBe(false)
    });
  });

  describe("isOptional", () => {
    it("return true if type is null", () => {
      validator.isOptional(null)
    });

    it("return true if type is an array with a null value in it somewhere", () => {
      validator.isOptional([String, null])
    });

    it("return false if type is array and doesnt contain null", () => {
      validator.isOptional([String])
    });

    it("return false if type is not an array and isnt null", () => {
      validator.isOptional(String);
    });
  });

  describe("isValidMany", () => {
    it("returns true if one of the array of data types has the same types as the value", () => {
      expect(validator.isValidMany([String, Number], "name")).toBe(true)
    });

    it("returns false if none of the array of data types has the same types as the value", () => {
      expect(validator.isValidMany([Array, String], {})).toBe(false)
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
      expect(validator.isType(1, Number)).toBe(true);
      expect(validator.isType([], Array)).toBe(true);
    });

    it("returns false if value is not the same as schema type", () => {
      expect(validator.isType({}, Object)).toBe(true);
      expect(validator.isType({}, Array)).toBe(false);
      expect(validator.isType(1, String)).toBe(false);
      expect(validator.isType("string", Object)).toBe(false);
      expect(validator.isType([], Object)).toBe(false);
    });
  });

  describe("buildError", () => {
    it("returns string error message", () => {
      expect(validator.buildError("name", String)).toBe("name should be String")
    });
  });

  describe("isValid", () => {
    it("calls isValidMany if type is an array which is not optional", () => {
      validator.isValidMany = jest.fn()
      validator.isValid([String, Number], "name");
      expect(validator.isValidMany).toBeCalled();
    });

    it("calls isOptional if type is an array with optional value or null", () => {
      validator.isOptional = jest.fn();
      validator.isValid([String, null], "name");
      expect(validator.isOptional).toBeCalled();
    });

    it ("calls is object type if not optional and not an array of data types", () => {
      validator.isObjectType = jest.fn();
      validator.isValid(String, "name");
      expect(validator.isObjectType).toBeCalled();
    })
  });

  describe("validate", () => {
    it("should return true if all data matches all schema types", () => {
      expect(validator.validate({ products: productApiResponse }, settings.schema, settings, [], [])).toBeUndefined();
    });
  });
});