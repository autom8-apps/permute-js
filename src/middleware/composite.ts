import { IObjectOperation, ICompositeOptions, SchemaType } from "./interfaces";

export default class ShaperComposite implements IObjectOperation {
  private readonly formatters: IObjectOperation[];
  private readonly object: Object;
  private readonly schema: SchemaType;
  private output: Object;

  constructor(options: ICompositeOptions) {
    this.formatters = options.formatters;
    this.schema = options.schema;
    this.object = { ...options.object };
  }

  operate() {
    for (const formatter of this.formatters) {
      this.output = formatter.operate(this.object, this.schema);
    }

    return this.output;
  }
}