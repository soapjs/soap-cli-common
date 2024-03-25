import { TypeInfoObject } from "../../type.info";

export class TemplateModelTools {
  static generateNameFromType(type: TypeInfoObject) {
    return type?.name || "any";
  }
}
