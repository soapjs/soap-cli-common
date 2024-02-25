import { ClassSchemaObject, ExportSchemaObject } from "../types";
import { ConstructorTemplateModel } from "./constructor.template-model";
import { GenericTemplateModel } from "./generic.template-model";
import { ImportTemplateModel } from "./import.template-model";
import { InheritanceTemplateModel } from "./inheritance.template-model";
import { InterfaceTemplateModel } from "./interface.template-model";
import { MethodTemplateModel } from "./method.template-model";
import { PropTemplateModel } from "./prop.template-model";

export class ClassTemplateModel {
  static create(data: ClassSchemaObject) {
    const {
      exp,
      ctor,
      interfaces,
      inheritance,
      props,
      methods,
      generics,
      imports,
      name,
      is_abstract,
      template,
    } = data;

    return new ClassTemplateModel(
      is_abstract,
      name,
      exp,
      ctor ? ConstructorTemplateModel.create(ctor) : null,
      Array.isArray(interfaces)
        ? interfaces.map((i) => InterfaceTemplateModel.create(i))
        : [],
      Array.isArray(inheritance)
        ? inheritance.map((i) => InheritanceTemplateModel.create(i))
        : [],
      Array.isArray(props) ? props.map((i) => PropTemplateModel.create(i)) : [],
      Array.isArray(methods)
        ? methods.map((i) => MethodTemplateModel.create(i))
        : [],
      Array.isArray(generics)
        ? generics.map((g) => GenericTemplateModel.create(g))
        : [],
      Array.isArray(imports)
        ? imports.map((i) => ImportTemplateModel.create(i))
        : [],
      template
    );
  }

  constructor(
    public isAbstract: boolean,
    public name: string,
    public exp: ExportSchemaObject,
    public ctor: ConstructorTemplateModel,
    public interfaces: InterfaceTemplateModel[],
    public inheritance: InheritanceTemplateModel[],
    public props: PropTemplateModel[],
    public methods: MethodTemplateModel[],
    public generics: GenericTemplateModel[],
    public imports: ImportTemplateModel[],
    public template: string
  ) {}
}
