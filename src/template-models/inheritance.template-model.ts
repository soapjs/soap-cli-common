import { InheritanceSchemaObject } from "../types";
import { GenericTemplateModel } from "./generic.template-model";

export class InheritanceTemplateModel {
  static create(data: InheritanceSchemaObject) {
    const { name, generics } = data;
    return new InheritanceTemplateModel(
      name,
      Array.isArray(generics)
        ? generics.map((g) => GenericTemplateModel.create(g))
        : []
    );
  }

  constructor(public name: string, public generics: GenericTemplateModel[]) {}
}
