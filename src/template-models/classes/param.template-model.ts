import {
  DecoratorSchemaObject,
  ParamSchemaObject,
} from "../../schemas/classes";
import { TemplateModelTools } from "../tools/template-model.tools";

export class ParamTemplateModel {
  static create(data: ParamSchemaObject) {
    const {
      access,
      name,
      is_optional,
      is_readonly,
      value,
      template,
      decorators,
    } = data;
    const type = TemplateModelTools.generateNameFromType(data.type).replace(
      "<>",
      ""
    );
    return new ParamTemplateModel(
      access,
      name,
      type,
      is_optional,
      is_readonly,
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
    public value: any,
    public decorators: DecoratorSchemaObject[],
    public template?: string
  ) {}
}
