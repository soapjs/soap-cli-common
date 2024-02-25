import { TypeSchemaObject, ExportSchemaObject } from "../types";
import { GenericTemplateModel } from "./generic.template-model";
import { ImportTemplateModel } from "./import.template-model";
import { PropTemplateModel } from "./prop.template-model";

export class TypeTemplateModel {
  static create(data: TypeSchemaObject) {
    const { exp, props, generics, imports, name, alias } = data;

    return new TypeTemplateModel(
      name,
      alias?.name || alias,
      exp,
      Array.isArray(props) ? props.map((i) => PropTemplateModel.create(i)) : [],
      Array.isArray(generics)
        ? generics.map((g) => GenericTemplateModel.create(g))
        : [],
      Array.isArray(imports)
        ? imports.map((i) => ImportTemplateModel.create(i))
        : []
    );
  }

  constructor(
    public name: string,
    public alias: string,
    public exp: ExportSchemaObject,
    public props: PropTemplateModel[],
    public generics: GenericTemplateModel[],
    public imports: ImportTemplateModel[]
  ) {}
}
