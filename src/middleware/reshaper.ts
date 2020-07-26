import { IObjectOperation, SchemaType, SchemaTypeSettings, ISettings, IModel, IModelDictionary } from "./interfaces";

export class ReShaper implements IObjectOperation {
  private readonly schema: SchemaType;
  private readonly settings: ISettings;

  private output: IModelDictionary;
  private object: object;

  constructor(options: SchemaTypeSettings, object: object) {
    this.schema = options.schema;
    this.object = object
    this.settings = options.settings;
  }

  operate() {
    try {
      return this.build();
    } catch (error) {
      console.error("Object Shaper", error);
    }
  }

  notChildResource(formattedKey: string, unformattedItem: object): boolean {
    return this.schema[formattedKey] && !Array.isArray(unformattedItem[formattedKey]);
  }

  notRelatableCollection(unformattedItem: object): boolean {
    return !unformattedItem[0][this.settings.uid];
  }

  get uid(): string {
    return this.settings.uid || "id";
  }

  get childUid(): string {
    return this.settings.childrenUid || this.settings.uid || "id";
  }

  formatChildren(formattedKey: string, unformattedItem: object): object {
    if (this.notChildResource(formattedKey, unformattedItem)) return unformattedItem;
    if (this.notRelatableCollection(unformattedItem)) return unformattedItem;

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
    this.mapKeys();
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

  mapKeys() {
    const { map } = this.settings;
    const formatted = {};
    for (const { from, to } of map) {
      if (this.schema[to]) {
        formatted[to] = this.object[from];
      }
    }

    this.object = Object.keys(formatted);
  }
}