import { TypeInfoObject } from "../types";

export class TemplateModelTools {
  static generateNameFromType(type: TypeInfoObject) {
    return type?.name || "unknown";
  }
}
