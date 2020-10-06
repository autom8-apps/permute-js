import { Mapper } from "../shapers/mapper";

describe("Mapper", () => {
  const mapper = new Mapper();
  const settings = {
    map: {
      products: {
        availableForSale: "available",
        productType: "type",
        name: "title",
        variants: {
          title: "name",
          availableForSale: "available",
          productType: "type",
          onlineStoreUrl: "url"
        }
      }
    }
  };

  const entity = {
    title: "name",
    availableForSale: "available",
    productType: "type",
    onlineStoreUrl: "url"
  };

  describe('Mapper.isMappable', () => {
    it('should return false if settings isnt set', () => {
      expect(mapper.isMappable(undefined, {})).toBe(false);
    });

    it('should return true if settings and entity are set and settings has the map property', () => {
      // @ts-ignore
      expect(mapper.isMappable(settings, {})).toBe(true);
    });

    it('should return false if settings is set but entity is not set', () => {
      // @ts-ignore
      expect(mapper.isMappable(settings, undefined)).toBe(false);
    });
  });
})

