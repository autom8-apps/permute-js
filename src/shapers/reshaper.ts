import { IObjectOperation, ISettings, IModelDictionary, LodashUtils } from "./interfaces";

export class ReShaper implements IObjectOperation {
  private settings: ISettings;
  private output: IModelDictionary;
  private object: object;
  private readonly _: LodashUtils;

  constructor(_: LodashUtils) {
    this._ = _;
  }

  operate(object: object, settings: ISettings): IModelDictionary {
    try {
      this.object = object;
      this.settings = settings;
      return this.build();
    } catch (error) {
      console.error("Object Shaper", error);
    }
  }

  notChildResource(formattedKey: string, unformattedItem: object): boolean {
    return !this.settings.schema.children
      && !this.settings.schema.children.includes(formattedKey)
      && !Array.isArray(unformattedItem[formattedKey]);
  }

  notRelatableCollection(formattedKey: string, unformattedItem: object): boolean {
    return !this.settings.schema.children.includes(formattedKey) && !unformattedItem[0][this.settings.uid];
  }

  get uid(): string {
    return this.settings.uid || "id";
  }

  get childUid(): string {
    return this.settings.childrenUid || this.settings.uid || "id";
  }

  formatChildren(formattedKey: string, unformattedItem: object): object {
    if (this.notChildResource(formattedKey, unformattedItem)) return unformattedItem;
    if (this.notRelatableCollection(formattedKey, unformattedItem)) return unformattedItem;

    let hasMany = [];
    for (const child of unformattedItem[formattedKey]) {
      const id = child[this.childUid];
      child.belongsTo = this.object[this.uid];
      this.output[formattedKey][child[this.uid]] = child[this.settings.uid];
      hasMany.push(id);
    }

    this.output[formattedKey].hasMany = hasMany;
  }

  build(): IModelDictionary {
    for (let key in this.object) {
      const formattedKey = this.formatKey(key);
      const formattedWithChildren = this.formatChildren(formattedKey, this.object[key]);
      this.output[formattedKey] = formattedWithChildren;
    }

    return this.output;
  }

  formatKey(key: string): string {
    return this.snakeToCamelCase(key).toString();
  }

  snakeToCamelCase(prop: string): string {
    return prop.replace(/([-_][a-z])/g, (group) =>
      group
        .toUpperCase()
        .replace("-", "")
        .replace("_", "")
    );
  }

  get canMap(): boolean {
    return this.settings.map && Object.keys(this.settings.map).length > 0;
  }

  mapKeys(): void {
    if (!this.canMap) return;

    const oldKeys = [];
    const formatted = {};

    for (const mapPoint of this.settings.map[this.settings.current]) {
      formatted[mapPoint.to] = this.object[mapPoint.from];
      oldKeys.push(mapPoint.from);
    }

    this.object = { ...this._.omit(this.object, oldKeys), ...formatted };
  }
}