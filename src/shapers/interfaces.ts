export interface IObjectOperation {
  operate: (object: object, settings ?: ISettings) => Object|IModelDictionary,
}

export interface IStrategy {
  setStrategy: (strategy: IObjectOperation) => void
  operate: (object: object, settings?: ISettings) => Object | IModelDictionary,
}

export interface SchemaType {
  [key: string]: Function|object|null
}

export interface SchemaError {
  [key: string]: string;
}

export interface SchemaTypeSettings {
  schema: SchemaType
  settings?: ISettings
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

export interface IObjectOperationDictionary {
  [key: string]: IObjectOperation
}

export interface ISettings {
  schema: SchemaType
  map?: ISettingsMapPoint[]
  validate?: boolean
  uid?: string
  childrenUid?: string
  clean?: boolean
}

export interface IModel {
  hasMany?: string[]
  belongsTo?: string
}

export interface IModelDictionary {
  [key: string]: IModel
}