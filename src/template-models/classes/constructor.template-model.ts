import {
  ConstructorSchemaObject,
  DecoratorSchemaObject,
} from "../../schemas/classes";
import { BodyTemplateModel } from "./body.template-model";
import { ParamTemplateModel } from "./param.template-model";

export class ConstructorTemplateModel {
  static create(data: ConstructorSchemaObject) {
    const { access, params, body, supr, template, decorators } = data;

    return new ConstructorTemplateModel(
      access,
      Array.isArray(params)
        ? params.map((p) => ParamTemplateModel.create(p))
        : [],
      BodyTemplateModel.create(body),
      supr ? ConstructorTemplateModel.create(supr) : null,
      Array.isArray(decorators) ? decorators : [],
      template
    );
  }

  protected constructor(
    public access: string,
    public params: ParamTemplateModel[],
    public body: BodyTemplateModel,
    public supr: ConstructorTemplateModel,
    public decorators: DecoratorSchemaObject[],
    public template: string
  ) {}
}
