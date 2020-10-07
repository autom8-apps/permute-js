
// @ts-nocheck
import { Mapper } from "../shapers/mapper";
import { productApiResponse } from "../mocks/product";

describe("Mapper", () => {
  const settingsMock = {
    schema: {},
    map: {
      products: {
        availableForSale: "available",
        productType: "type",
        title: "name",
        variants: {
          title: "name",
          available: "inStock",
          compareAtPrice: "price",
          image: {
            _name: "photo",
            src: "url"
          },
          hasNextPage: "next"
        }
      }
    }
  };

  const settingsSingleEntityMockComplex = {
    schema: {},
    map: {
      product: {
        availableForSale: "available",
        productType: "type",
        title: "name",
        variants: {
          title: "name",
          available: "inStock",
          compareAtPrice: "price",
          image: {
            _name: "photo",
            src: "url"
          },
          hasNextPage: "next"
        }
      }
    }
  };

  const collectionMock = { products: [productApiResponse] }
  const singleEntityMock = { product: productApiResponse }

  const settingsSingleEntityMock = {
    availableForSale: "available",
    productType: "type",
    title: "name",
  };

  const variantSingleEntityMock = {
    available: "inStock",
    title: "name",
    compareAtPrice: "price",
    image: {
      _name: "photo",
      src: "url"
    },
    hasNextPage: "next"
  }

  const mapper = new Mapper();
  mapper.settings = settingsMock;

  describe('Mapper.isMappable', () => {
    it('should return false if settings isnt set', () => {
      expect(mapper.isMappable(undefined, variantSingleEntityMock)).toBe(false);
    });

    it('should return true if settings and entity are set and settings has the map property', () => {
      expect(mapper.isMappable(settingsMock, variantSingleEntityMock)).toBe(true);
    });

    it('should return false if settings is set but entity is not set', () => {
      expect(mapper.isMappable(settingsMock, undefined)).toBe(false);
    });
  });

  describe('Mapper.isEntity', () => {
    it('should return false if settings isnt set', () => {
      expect(mapper.isEntity(undefined, variantSingleEntityMock)).toBe(false);
    });

    it('should return true if settings and entity are set and settings has the map property', () => {
      expect(mapper.isEntity(settingsMock, variantSingleEntityMock)).toBe(true);
    });

    it('should return false if settings is set but entity is not an object', () => {
      expect(mapper.isEntity(settingsMock, "string")).toBe(false);
    });
  });

  describe('Mapper.isCollection', () => {
    it('should return true if entity map is an object and entity is an array of objects', () => {
      expect(mapper.isCollection(settingsMock, [variantSingleEntityMock])).toBe(true);
    });

    it('should return false if entity map is an object and entity is an array of non-objects', () => {
      expect(mapper.isCollection(settingsMock, [])).toBe(false);
    });

    it('should return false if entity map is not an object', () => {
      expect(mapper.isCollection("string", [])).toBe(false);
    });
  });

  describe('Mapper.mapCollection', () => {
    it("should iterate through a collection mapping each entity to it's corresponding entity map", () => {
      const formatted = mapper.mapCollection(settingsMock.map.products.variants, productApiResponse.variants);
      expect(Array.isArray(formatted)).toBe(true);
      expect(formatted[0].name).toBeDefined();
      expect(formatted[0].inStock).toBeDefined();
      expect(formatted[0].price).toBeDefined();
      expect(formatted[0].next).toBeDefined();
    });
  });

  describe("Mapper.mapKeys", () => {
    it("should map a single entity to it's corresponding entity map and have no other props available", () => {
          mapper.settings = {
            map: variantSingleEntityMock
          };

          const formatted = mapper.mapKeys(variantSingleEntityMock, productApiResponse.variants[0]);
          expect(formatted.name).toBeDefined();
          expect(formatted.inStock).toBeDefined();
          expect(formatted.price).toBeDefined();
          expect(formatted.photo).toBeDefined();
          expect(formatted.priceV2).not.toBeDefined();
    });
  });

  describe('mapEntity', () => {
    it("should map a single entity if it is not a collection of entities to the corresponding entity map", () => {
      const spyIsCollection = jest.spyOn(mapper, "isCollection");
      const mapCollectionSpy = jest.spyOn(mapper, "mapCollection");
      const spyMapSingleEntity = jest.spyOn(mapper, "mapEntity");
      const mappedResult = mapper.mapEntity(settingsSingleEntityMock, productApiResponse);
      expect(spyIsCollection).toBeCalled();
      expect(mapCollectionSpy).not.toBeCalled();
      expect(spyMapSingleEntity).toBeCalledTimes(1);
      expect(spyMapSingleEntity).toBeCalledWith(settingsSingleEntityMock, productApiResponse);
      expect(mappedResult.available).toBeDefined();
      expect(mappedResult.type).toBeDefined();
      expect(mappedResult.name).toBeDefined();
    });

    it("should map a collection of entities if it is a collection to the corresponding entity map", () => {
      const spyIsCollection = jest.spyOn(mapper, "isCollection");
      const mapCollectionSpy = jest.spyOn(mapper, "mapCollection");
      const spyMapSingleEntity = jest.spyOn(mapper, "mapEntity");
      const mappedResult = mapper.mapEntity(variantSingleEntityMock, productApiResponse.variants);
      expect(spyIsCollection).toBeCalled();
      expect(mapCollectionSpy).toBeCalled();
      expect(spyMapSingleEntity).toBeCalled();
      expect(Array.isArray(mappedResult)).toBe(true);
      expect(mappedResult[0].inStock).toBeDefined();
      expect(mappedResult[0].available).not.toBeDefined();
      expect(mappedResult[0].next).toBeDefined();
      expect(mappedResult[0].price).toBeDefined();
      expect(mappedResult[0].name).toBeDefined();
      expect(mappedResult[0].photo).toBeDefined();
      expect(mappedResult[0].photo.url).toBeDefined();
      expect(mappedResult[0].photo.src).not.toBeDefined();
      expect(mappedResult[0]["[object Object]"]).not.toBeDefined();
    });
  });

  describe('Mapper.format', () => {
    it("should map data collection based on settings and data provided", () => {
      const mappedResult = mapper.format(collectionMock);
      expect(mappedResult).toBeDefined();
      expect(typeof mappedResult === "object").toBe(true);
      expect(mappedResult.products).toBeDefined();
      expect(typeof mappedResult.products[0] === "object").toBe(true);
      expect(mappedResult.products[0].available).toBe(true);
      expect(mappedResult.products[0].variants).toBeDefined();
      expect(Array.isArray(mappedResult.products[0].variants)).toBe(true);
      expect(typeof mappedResult.products[0].variants[0] === "object").toBe(true);
    });
    it("should map single data entity based on settings and data provided", () => {
      mapper.settings = settingsSingleEntityMockComplex;
      const mappedResult = mapper.format(singleEntityMock);
      expect(mappedResult).toBeDefined();
      expect(typeof mappedResult === "object").toBe(true);
      expect(mappedResult.product.variants).toBeDefined();
      expect(mappedResult.product.available).toBeDefined();
      expect(Array.isArray(mappedResult.product.variants)).toBe(true);
      expect(typeof mappedResult.product.variants[0] === "object").toBe(true);
    });
  });

  describe('Mapper.operate', () => {
    it("should asynchronously map based on settings and data provided", async () => {
      const mappedResult = await mapper.operate(collectionMock, settingsMock);
      expect(mappedResult.products).toBeDefined();
    });
  });

  afterEach(() => {
    mapper.settings = settingsMock;
    jest.restoreAllMocks();
  })
})

