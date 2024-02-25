import { FunctionSchemaObject, ExportSchemaObject } from "../types";
import { TemplateModelTools } from "../tools/template-model.tools";
import { BodyTemplateModel } from "./body.template-model";
import { GenericTemplateModel } from "./generic.template-model";
import { ParamTemplateModel } from "./param.template-model";

export class FunctionTemplateModel {
  static create(data: FunctionSchemaObject) {
    const {
      name,
      is_async,
      return_type,
      generics,
      params,
      body,
      exp,
      template,
    } = data;

    return new FunctionTemplateModel(
      exp,
      name,
      TemplateModelTools.generateNameFromType(return_type),
      is_async,
      Array.isArray(params)
        ? params.map((p) => ParamTemplateModel.create(p))
        : [],
      BodyTemplateModel.create(body),
      Array.isArray(generics)
        ? generics.map((g) => GenericTemplateModel.create(g))
        : [],
      template
    );
  }

  constructor(
    public exp: ExportSchemaObject,
    public name: string,
    public return_type: string,
    public is_async: boolean,
    public params: ParamTemplateModel[],
    public body: BodyTemplateModel,
    public generics: GenericTemplateModel[],
    public template: string
  ) {}
}
