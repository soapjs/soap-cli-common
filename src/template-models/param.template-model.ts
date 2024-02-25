import { ParamSchemaObject } from "../types";
import { TemplateModelTools } from "../tools/template-model.tools";

export class ParamTemplateModel {
  static create(data: ParamSchemaObject) {
    const { access, name, type, is_optional, is_readonly, value, template } =
      data;

    return new ParamTemplateModel(
      access,
      name,
      TemplateModelTools.generateNameFromType(type),
      is_optional,
      is_readonly,
      value,
      template
    );
  }

  constructor(
    public access: string,
    public name: string,
    public type: string,
    public is_optional: boolean,
    public is_readonly: boolean,
    public value: any,
    public template: any
  ) {}
}
