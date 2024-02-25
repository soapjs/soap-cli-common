import { PropSchemaObject } from "../types";
import { TemplateModelTools } from "../tools/template-model.tools";

export class PropTemplateModel {
  static create(data: PropSchemaObject) {
    const {
      access,
      name,
      type,
      is_optional,
      is_readonly,
      is_static,
      value,
      template,
    } = data;

    return new PropTemplateModel(
      access,
      name,
      TemplateModelTools.generateNameFromType(type),
      is_optional,
      is_readonly,
      is_static,
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
    public is_static: boolean,
    public value: any,
    public template: any
  ) {}
}
