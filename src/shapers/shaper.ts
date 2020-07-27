import { ISettings, LodashUtils } from "./interfaces";

export abstract class Shaper {
  protected output: object;
  protected readonly _: LodashUtils;

  constructor(_: LodashUtils) {
    this._ = _;
  }

  isCollection(resource: object[], type: any): boolean {
    return resource && Array.isArray(resource) && this._.isPlainObject(type);
  }

  uid(id: string): string {
    return id || "id";
  }

  isResource(type: any, subject: any): boolean {
    return this._.isPlainObject(type) && this._.isPlainObject(subject);
  }

  pickChildren(currentResource: object, childKeys: string[]) {
    return this._.pick(Object.keys(currentResource), childKeys);
  }
}