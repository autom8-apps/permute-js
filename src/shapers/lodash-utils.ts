import { omit, isObject, isPlainObject, once, hasIn, zipObject, pick, mapKeys, merge, flatMap } from "lodash";
import { LodashUtils } from "./interfaces";
export const _: LodashUtils = Object.freeze({
  omit,
  isObject,
  isPlainObject,
  hasIn,
  zipObject,
  pick,
  mapKeys,
  merge,
  flatMap
});