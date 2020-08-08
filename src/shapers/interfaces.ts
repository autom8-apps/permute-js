export interface IObjectOperation {
  operate: (object: object, settings ?: ISettings) => Object|IModelDictionary,
}

export type IOperation = (object: object, settings?: ISettings) => Object | IModelDictionary;

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
  operate: (object: object, settings?: ISettings) => Object | IModelDictionary,
}

export interface Schema {
  [key: string]: SchemaType
}

export interface SchemaType {
  _uid: string;

  // added automatically after formatting
  belongsTo?: SchemaType;

  // added automatically after formatting
  hasMany?: SchemaType;
  [key: string]: Function | FunctionConstructor | StringConstructor | ArrayConstructor | ObjectConstructor | NumberConstructor | object | null | any
}

export interface SchemaError {
  [key: string]: string;
}

export interface Validator {
  optional: true,
  type: FunctionConstructor,
}

export interface LengthValidator extends Validator {
  min: Number,
  max: Number,
}

export interface ISettingsMapPoint {
  from: string
  to: string
}

export interface ISettingsMapPoints {
  [key: string]: ISettingsMapPoint[]
}

export interface IObjectOperationDictionary {
  [key: string]: IObjectOperation
}

export interface ISettings {
  current ?: string
  schema: Schema
  map?: ISettingsMapPoints
  validate?: boolean
  uid?: string
  childrenUid?: string
  clean?: boolean
}

export interface IModelDictionary {
  [key: string]: {}
}