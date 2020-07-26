export interface IObjectOperation {
  operate: (object?: Object, schema?: Object) => Object,
}

export interface SchemaType {
  [key: string]: Function|object|null
}

export interface SchemaTypeSettings {
  schema: SchemaType
  settings?: ISettings
}

export interface ICompositeOptions {
  formatters: IObjectOperation[]
  schema: SchemaType,
  object: Object,
  settings?: ISettings
}

export interface IComposite {
  constructor: (options: ICompositeOptions) => Object
}

export interface Validator {
  optional: true,
  type: FunctionConstructor,
}

export interface LengthValidator extends Validator {
  min: Number,
  max: Number,
}

interface ISettingsMapPoint {
  from: string
  to: string
}

export interface ISettings {
  map?: ISettingsMapPoint[]
  validate?: boolean
  uid?: string
  childrenUid?: string
}

export interface IModel {
  hasMany?: string[]
  belongsTo?: string
}

export interface IModelDictionary {
  [key: string]: IModel
}