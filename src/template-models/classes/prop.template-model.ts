import { DecoratorSchemaObject, PropSchemaObject } from "../../schemas/classes";
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
      decorators,
    } = data;

    return new PropTemplateModel(
      access,
      name,
      TemplateModelTools.generateNameFromType(type),
      is_optional,
      is_readonly,
      is_static,
      value,
      Array.isArray(decorators) ? decorators : [],
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
    public decorators: DecoratorSchemaObject[],
    public template?: string
  ) {}
}
