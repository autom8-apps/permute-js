export interface IObjectOperation {
  operate: (object: object, settings ?: ISettings) => Promise<object|IModelDictionary>
}

export type IOperation = (object: object, settings?: ISettings) => object | IModelDictionary;

export interface LodashUtils {
  isPlainObject: Function
  isObject: Function
  omit: Function
  hasIn: Function
  zipObject: Function
  pick: Function
  mapKeys: Function
  merge: Function
  flatMap: Function
}

export interface IStrategy {
  setStrategy: (strategy: IObjectOperation) => void
  getStrategy: (classKey: string) => IObjectOperation
  operate: (object: object, settings?: ISettings) => Promise<object | IModelDictionary>,
}

export interface Schema {
  [key: string]: SchemaType
}

export interface SchemaType {
  _uid: string;
  [key: string]: Function | FunctionConstructor | StringConstructor | ArrayConstructor | ObjectConstructor | NumberConstructor | object | null | any
}

export interface Validator {
  optional: true,
  type: FunctionConstructor,
}

export interface LengthValidator extends Validator {
  min: Number,
  max: Number,
}

export interface IMapperSettings {
  [key: string]: IMapperEntitySettings
}

export interface IMapperEntitySettings {
  [key: string]: string | IMapperEntitySettings
}

export interface IObjectOperationDictionary {
  [key: string]: IObjectOperation
}

export interface ISettings {
  current ?: string
  schema: Schema
  map?: IMapperSettings
  validate?: boolean
  uid?: string
  childrenUid?: string
  clean?: boolean
}

export interface IModelDictionary {
  [key: string]: {}
}