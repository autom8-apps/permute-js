// @ts-nocheck
import { Validator } from "../shapers/validator";
import { LodashUtils } from "../shapers/interfaces";
import { productApiResponse, productCollection } from "../mocks/product";
import { Product as settings } from "../mocks/entities";
import { omit, isObject, isPlainObject, hasIn, zipObject, pick, mapKeys, merge } from "lodash";
const _: LodashUtils = Object.freeze({ omit, isObject, isPlainObject, hasIn, zipObject, pick, mapKeys, merge });

describe("", () => {

  describe("Shaper", () => {
    let validator;

    beforeEach(() => {
      validator = new Validator(_);
    });

    afterEach(() => {
      settings.current = undefined;
    });

});