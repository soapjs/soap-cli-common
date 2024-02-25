import { MethodSchemaObject } from "../types";
import { TemplateModelTools } from "../tools/template-model.tools";
import { BodyTemplateModel } from "./body.template-model";
import { GenericTemplateModel } from "./generic.template-model";
import { ParamTemplateModel } from "./param.template-model";

export class MethodTemplateModel {
  static create(data: MethodSchemaObject) {
    const {
      access,
      name,
      is_async,
      is_static,
      return_type,
      generics,
      params,
      body,
      supr,
      template,
    } = data;

    return new MethodTemplateModel(
      access,
      name,
      TemplateModelTools.generateNameFromType(return_type),
      is_async,
      is_static,
      params.map((p) => ParamTemplateModel.create(p)),
      BodyTemplateModel.create(body),
      supr ? MethodTemplateModel.create(supr) : null,
      Array.isArray(generics)
        ? generics.map((g) => GenericTemplateModel.create(g))
        : [],
      template
    );
  }

  constructor(
    public access: string,
    public name: string,
    public return_type: string,
    public is_async: boolean,
    public is_static: boolean,
    public params: ParamTemplateModel[],
    public body: BodyTemplateModel,
    public supr: MethodTemplateModel,
    public generics: GenericTemplateModel[],
    public template: string
  ) {}
}
