import { Mapper } from "../shapers/mapper";
import { IObjectOperation, ISettings, LodashUtils, SchemaType, IModelDictionary } from "../shapers/interfaces";
import { productApiResponse } from "../mocks/product";

describe("Mapper", () => {
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

  describe('Mapper.format', () => {
    it('should map properties to the correct properties based on the settings', () => {

    });
  });
})

