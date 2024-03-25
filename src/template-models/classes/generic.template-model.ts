import { GenericSchemaObject } from "../../schemas/classes";
import { InheritanceTemplateModel } from "./inheritance.template-model";

export class GenericTemplateModel {
  static create(data: GenericSchemaObject) {
    const { dflt, name, inheritance } = data;
    return new GenericTemplateModel(
      name,
      dflt,
      inheritance ? InheritanceTemplateModel.create(inheritance) : null
    );
  }

  constructor(
    public name: string,
    public dflt: string,
    public inheritance: InheritanceTemplateModel,
    public template?: string
  ) {}
}
