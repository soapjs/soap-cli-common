import { nanoid } from "nanoid";
import { TypeInfo, TypeInfoObject } from "../../type.info";
import { SchemaTools } from "../../schemas/tools/schema.tools";
import {
  PropSchema,
  GenericSchema,
  MethodSchema,
  InterfaceSchema,
  ImportSchema,
  ImportTools,
  ImportData,
  TestCaseSchema,
  FunctionSchema,
  ElementSchemaObject,
  ExportSchema,
  InheritanceSchema,
  ConstructorSchema,
  DecoratorData,
} from "../../schemas/classes";
import { ComponentTools } from "../tools/component.tools";
import { Config, ConfigJsonAddons } from "../../config";
import { WriteMethod } from "../../enums";

export type Dependency = {
  id: string;
  name: string;
  type: TypeInfoObject;
  path: string;
};

export type ElementSchema = ConfigJsonAddons & {
  name: string;
  template?: string;
  exp?: ExportSchema;
  inheritance?: InheritanceSchema[];
  ctor?: ConstructorSchema;
  methods?: MethodSchema[];
  props?: PropSchema[];
  generics?: GenericSchema[];
  interfaces?: InterfaceSchema[];
  imports?: ImportSchema[];
  functions?: FunctionSchema[];
  tests?: TestCaseSchema[];
  alias?: any;
};

export type ComponentData<
  Element = ElementSchemaObject,
  ElementAddons = unknown
> = {
  id: string;
  type: TypeInfoObject;
  path: string;
  write_method: string;
  addons: ElementAddons;
  element: Element;
  dependencies: Dependency[];
};

export interface ElementWithProps {
  props: PropSchema[];
  addProp(prop: PropSchema);
  findProp(name: string): PropSchema;
  hasProp(name: string): boolean;
}

export interface ElementWithGenerics {
  generics: GenericSchema[];
  addGeneric(generic: GenericSchema);
  findGeneric(name: string): GenericSchema;
  hasGeneric(name: string): boolean;
}

export interface ElementWithDecorators {
  decorators: DecoratorData[];
  addDecorator(decorator: DecoratorData);
  findDecorator(name: string): DecoratorData;
  hasDecorator(name: string): boolean;
}

export interface ElementWithMethods {
  methods: MethodSchema[];
  addMethod(method: MethodSchema);
  findMethod(name: string): MethodSchema;
  hasMethod(name: string): boolean;
}

export interface ElementWithFunctions {
  functions: FunctionSchema[];
  addFunction(fn: FunctionSchema);
  findFunction(name: string): FunctionSchema;
  hasFunction(name: string): boolean;
}

export interface ElementWithUnitTests {
  tests: TestCaseSchema[];
  addTest(test: TestCaseSchema);
  findTest(name: string): TestCaseSchema;
  hasTest(name: string): boolean;
}

export interface ElementWithInterfaces {
  interfaces: InterfaceSchema[];
  addInterface(intf: InterfaceSchema);
  findInterface(name: string): InterfaceSchema;
  hasInterface(name: string): boolean;
}

export interface ElementWithImports {
  interfaces: ImportSchema[];
  addImport(intf: ImportSchema);
  findImport(data: ImportData): ImportSchema;
  hasImport(name: string): boolean;
}

export type ComponentElement = ElementSchema &
  ElementWithImports & {
    toObject(): ElementSchemaObject;
    listTypes(): TypeInfo[];
  };

export class Component<
  Element extends ComponentElement = ComponentElement,
  ElementAddons = any
> {
  public static create<
    Element extends ComponentElement,
    ElementAddons = unknown
  >(
    config: Config,
    data: {
      id: string;
      type: TypeInfo;
      endpoint?: string;
      path: string;
      writeMethod: WriteMethod;
      addons?: ElementAddons;
      element: Element;
      dependencies?: Component[];
    }
  ): Component<Element, ElementAddons> {
    const {
      id,
      type,
      endpoint,
      path,
      writeMethod,
      addons,
      element,
      dependencies,
    } = data;
    const component = new Component(
      id || nanoid(),
      type,
      endpoint,
      path,
      writeMethod,
      addons,
      element
    );

    if (Array.isArray(dependencies)) {
      dependencies.forEach((d) => {
        component.addDependency(d, config);
      });
    }

    return component;
  }

  private __dependencies: Dependency[] = [];

  protected constructor(
    public readonly id: string,
    public readonly type: TypeInfo,
    public readonly endpoint: string,
    public readonly path: string,
    public readonly writeMethod: WriteMethod,
    public readonly addons: ElementAddons,
    public readonly element: Element
  ) {}

  addDependency(dependency: Component | Dependency, config: Config) {
    const { id, path, type } = dependency;

    if (dependency) {
      if (this.hasDependency(dependency) === false) {
        if (dependency["element"]) {
          const { element } = dependency as Component;
          this.__dependencies.push({ id, path, type, name: element.name });

          if (Array.isArray(this.element.imports) && this.path !== path) {
            const relativePath = ImportTools.createRelativeImportPath(
              this.path,
              path
            );
            const impt = this.element.findImport({ path: relativePath });
            if (impt) {
              if (element.exp?.isDefault && !impt.dflt) {
                impt.dflt["dflt"] = element.name;
              } else {
                impt.list.push(element.name);
              }
            } else {
              let impt = { path, ref_path: this.path };
              if (element.exp?.useWildcard) {
                impt["alias"] = element.name;
              } else if (element.exp?.isDefault) {
                impt["dflt"] = element.name;
              } else {
                impt["list"] = [element.name];
              }

              this.element.addImport(ImportSchema.create(impt, config));
            }
          }
        } else {
          this.__dependencies.push(dependency as Dependency);
        }
      }
    }
  }

  hasDependency(dependency: Component | Dependency) {
    if (!dependency) {
      return false;
    }

    return (
      this.__dependencies.findIndex((d) => {
        const name = dependency["element"]?.name || dependency["name"];
        return (
          d.name === name &&
          d.type.ref === dependency.type.ref &&
          d.type.type === dependency.type.type &&
          d.path === dependency.path
        );
      }) !== -1
    );
  }

  get unresolvedDependencies() {
    const { element, dependencies } = this;
    const types: TypeInfo[] = [];
    const list = element.listTypes();

    if (Array.isArray(list)) {
      list.forEach((type) => {
        ComponentTools.filterComponentTypes(type).forEach((componentType) => {
          if (
            dependencies.findIndex((d) =>
              TypeInfo.areIdentical(d.type, componentType)
            ) === -1
          ) {
            types.push(componentType);
          }
        });
      });
    }
    return types;
  }

  get dependencies() {
    return [...this.__dependencies];
  }

  toObject(): ComponentData<ElementSchemaObject, ElementAddons> {
    const {
      type,
      id,
      element,
      endpoint,
      path,
      addons,
      writeMethod: write_method,
      dependencies,
    } = this;

    return SchemaTools.removeNullUndefined({
      id,
      endpoint,
      type,
      path,
      write_method,
      dependencies,
      element: element?.toObject(),
      addons,
    });
  }
}
