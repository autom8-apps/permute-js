// @ts-nocheck
import { LodashUtils } from "../shapers/interfaces";
import { ReShaper } from "../shapers/reshaper";
import { productApiResponse, productCollection } from "../mocks/product";
import { Product } from "../mocks/entities";
import { cloneDeep } from "lodash";

describe("ReShaper", () => {
  let reshaper;
  let collectionMock;
  let productMock;
  let settings = Product;

  beforeEach(() => {
    reshaper = new ReShaper();
    collectionMock = cloneDeep(productCollection);
    productMock = cloneDeep(productApiResponse);
  });

  afterEach(() => {
    settings.current = undefined;
  });

  describe("hasMany()", () => {
    it("should return product.variants = string[] instead of a collection of variant objects", () => {
      const result = reshaper.hasMany(["variants"], productMock, {}, settings)
      expect(result["variants"]).toBeInstanceOf(Array);
      expect(result["variants"].length > 0).toBe(true);
      expect(typeof result["variants"][0] === "string").toBe(true);
    });
  });

  describe("belongsTo()", () => {
    it("should return resource with parentId attached as a value on the property corresponding to the parent i.e. 'products' on variants", () => {
      settings.current = "products";
      const result = reshaper.belongsTo("1", productMock.variants[0], settings);
      expect(result.products).toBe("1");
    });
  });

  describe("normalize()", () => {
    it("should return a normalized object with variants replaced with their ids in an array and all unnecessary props removed", () => {
      const cleaned = reshaper.normalize(productMock, settings, "products", ["variants"]);
      expect(cleaned.availableForSale).toBeDefined();
      expect(cleaned.images).toBeInstanceOf(Array);
      expect(Array.isArray(cleaned.variants)).toBe(true);
      expect(typeof cleaned.variants[0] === "string").toBe(true)
    });
  });

  describe("toDictionary()", () => {
    it("should return a normalized dictionary shape based on full schema definition", () => {
      settings.current = "products";
      const dictionary = reshaper.toDictionary(collectionMock, settings, settings.current, ["variants", "images"]);
      expect(dictionary[1].variants).toBeDefined();
      expect(dictionary[1].images).toBeInstanceOf(Array);
      expect(typeof dictionary[1].variants[0] === "string").toBe(true)
    });
  });

  describe("reduceChildResources()", () => {
    it("should return a dictionary object of all formatted child objects with belongsTo foreign ids back to their parents", () => {
      settings.current = "products";
      const childResources = reshaper.reduceChildResources(collectionMock, settings, ["images", "variants"]);
      expect(childResources.images).toBeDefined();
      expect(childResources.images["Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0SW1hZ2UvMTQ0MzQ4Nzk2MDI3Njc="]).toBeDefined();
      expect(childResources.variants).toBeDefined();
      expect(childResources.variants["Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMjI3MTc1MTE1MTY5NQ=="]).toBeDefined();
    });
  });

  describe("format()", () => {
    it("should return the data as is if schema is not defined for that resource", () => {
      settings.current = "customer";
      settings.schema["customer"] = {
        name: String,
        _uid: "name",
      };
      const plainObjectFormatted = [{ name: "joe" }];
      const result = reshaper.format(plainObjectFormatted, settings);
      expect(result).toMatchObject({"customer": { joe: { name: "joe" }}});
    });

    it("should return product and variant dictionary for a single product", () => {
      settings.current = "products";
      const result = reshaper.format([productMock], settings);
      expect(result.images).toBeDefined();
      expect(result.variants).toBeDefined();
    });
  });

  describe("isShapable", () => {
    it("should return true if plain object and schema is set as a shapable schema", () => {
      settings.current = "products";
      expect(reshaper.isShapable(settings, productMock)).toBe(true);
    });

    it("should return false if array of object and schema is set as a shapable schema", () => {
      settings.current = "boom";
      expect(reshaper.isShapable(settings, productMock)).toBe(false);
    });

    it("should return true if array of object and schema is set as a shapable schema", () => {
      settings.current = "products";
      expect(reshaper.isShapable(settings, collectionMock)).toBe(true);
    });
  });

  describe("operate", () => {
    it("should return an object formatted to it's schema", async () => {
      settings.current = "products";
      const result = await reshaper.operate(collectionMock, settings);
      expect(result.products[1]).toBeDefined();
      expect(result.variants['Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMjI3MTc1MTE1MTY5NQ==']).toBeDefined();
      expect(typeof result.products[1].variants[0] === "string").toBe(true);
      expect(typeof result.products[1].images[0] === "string").toBe(true);
      expect(typeof result.products[1].images[0] === "string").toBe(true);

      expect(result.products[2]).toBeDefined();
      expect(result.variants['Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMjI3MTc1MTE1MTY5NQ==']).toBeDefined();
      expect(typeof result.products[2].variants[0] === "string").toBe(true);
      expect(typeof result.products[2].images[0] === "string").toBe(true);
      expect(typeof result.products[2].images[0] === "string").toBe(true);

      expect(result.products[3]).toBeDefined();
      expect(result.variants['Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMjI3MTc1MTE1MTY5NQ==']).toBeDefined();
      expect(typeof result.products[3].variants[0] === "string").toBe(true);
      expect(typeof result.products[3].images[0] === "string").toBe(true);
      expect(typeof result.products[3].images[0] === "string").toBe(true);
    });
  });
});