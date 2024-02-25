import {
  ExportSchemaObject,
  GenericSchemaObject,
  InheritanceSchemaObject,
  InterfaceSchemaObject,
} from "../types";
import { ImportTemplateModel } from "./import.template-model";
import { MethodTemplateModel } from "./method.template-model";
import { PropTemplateModel } from "./prop.template-model";

export class InterfaceTemplateModel {
  static create(data: InterfaceSchemaObject) {
    const { exp, inheritance, props, methods, generics, name, imports } =
      data;

    return new InterfaceTemplateModel(
      name,
      exp,
      inheritance,
      Array.isArray(props) ? props.map((i) => PropTemplateModel.create(i)) : [],
      Array.isArray(methods)
        ? methods.map((i) => MethodTemplateModel.create(i))
        : [],
      generics,
      Array.isArray(imports)
        ? imports.map((i) => ImportTemplateModel.create(i))
        : []
    );
  }

  constructor(
    public name: string,
    public exp: ExportSchemaObject,
    public inheritance: InheritanceSchemaObject[],
    public props: PropTemplateModel[],
    public methods: MethodTemplateModel[],
    public generics: GenericSchemaObject[],
    public imports: ImportTemplateModel[]
  ) {}
}
