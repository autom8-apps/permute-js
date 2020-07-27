import { IObjectOperation, ISettings, LodashUtils, IModelDictionary } from "./interfaces";
import { Shaper } from "./shaper";

export class ReShaper extends Shaper implements IObjectOperation {
  constructor(_: LodashUtils) {
    super(_);
  }

  operate(resource: object[], settings: ISettings): object {
    try {
      if (this._.isPlainObject(resource)) {
        return this._.omit(
          resource,
          Object.keys(settings.schema)
        );
      }

      return this.format(resource, settings);
    } catch (error) {
      console.error("Object Shaper", error);
    }
  }

  format(resource: object[], settings: ISettings): IModelDictionary {
    return resource.reduce((final: object, current: object) => {
      final[settings.current][this.uid(settings.uid)] = this._.omit(
        current,
        settings.schema[settings.current]
      );

      if (settings.schema[settings.current].children) {
        this._.merge(
          this._.zipObject(
            this.pickChildren(
              final[settings.current][this.uid(settings.uid)],
              settings.schema[settings.current].children
            )
          ),
          final
        );
      }

      return final;
    }, {})
  }
}