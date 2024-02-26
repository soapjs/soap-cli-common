import { FileOutput } from "./file-output";
import { PluginMap } from "./plugin-map";
import { Result } from "./result";
import { FileTemplateModel } from "./template-models";
import { Texts } from "./texts";

/**
 * SCHEMA OBJECTS
 */

export type TypeInfoObject = {
  name: string;
  ref: string;
  tag: string;
  isArray?: boolean;
  isSet?: boolean;
  isMap?: boolean;
  isIterable?: boolean;
  isPrimitive?: boolean;
  isUnknownType?: boolean;
  isDatabaseType?: boolean;
  isFrameworkDefaultType?: boolean;
  isMultiType?: boolean;
  isComponentType?: boolean;
  isInterface?: boolean;
  isClass?: boolean;
  isEntity?: boolean;
  isToolset?: boolean;
  isDataContext?: boolean;
  isModel?: boolean;
  isSource?: boolean;
  isRepository?: boolean;
  isRepositoryImpl?: boolean;
  isRepositoryFactory?: boolean;
  isUseCase?: boolean;
  isController?: boolean;
  isMapper?: boolean;
  isRoute?: boolean;
  isRouteIO?: boolean;
  isRouteModel?: boolean;
  isConfigInstructionType?: boolean;
  isTestSuite?: boolean;
  type?: string;
  component?: string;
};

export type TypeSchemaObject = ConfigJsonAddons & {
  exp?: ExportSchemaObject;
  name: string;
  props?: PropSchemaObject[];
  generics?: GenericSchemaObject[];
  alias?: any;
  imports?: ImportSchemaObject[];
};

export type ParamSchemaObject = ConfigJsonAddons & {
  name: string;
  type: TypeInfoObject;
  access: string;
  is_optional: boolean;
  is_readonly: boolean;
  value: any;
  template?: string;
};

export type PropSchemaObject = ConfigJsonAddons & {
  name: string;
  type: TypeInfoObject;
  access: string;
  is_optional: boolean;
  is_readonly: boolean;
  is_static: boolean;
  value: any;
  template: string;
};

export type MethodSchemaObject = ConfigJsonAddons & {
  access: string;
  name: string;
  return_type: TypeInfoObject;
  is_async: boolean;
  is_static: boolean;
  params: ParamSchemaObject[];
  body: any;
  template: string;
  supr: MethodSchemaObject;
  generics: GenericSchemaObject[];
};

export type GenericSchemaObject = ConfigJsonAddons & {
  name: string;
  inheritance: InheritanceSchemaObject;
  dflt: string;
};

export type ImportSchemaObject = ConfigJsonAddons & {
  dflt: string;
  path: string;
  list: string[];
  alias: string;
};

export type ExportSchemaObject = ConfigJsonAddons & {
  is_default?: boolean;
  use_wildcard?: boolean;
  path?: string;
  list?: string[];
  alias?: string;
};

export type InheritanceSchemaObject = ConfigJsonAddons & {
  generics: GenericSchemaObject[];
  name: string;
};

export type InterfaceSchemaObject = ConfigJsonAddons & {
  exp?: ExportSchemaObject;
  inheritance?: InheritanceSchemaObject[];
  props?: PropSchemaObject[];
  methods?: MethodSchemaObject[];
  generics?: GenericSchemaObject[];
  imports?: ImportSchemaObject[];
  name: string;
};

export type ConstructorSchemaObject = ConfigJsonAddons & {
  access: string;
  params: ParamSchemaObject[];
  body: string;
  template: string;
  supr: ConstructorSchemaObject;
};

export type ClassSchemaObject = ConfigJsonAddons & {
  is_abstract?: boolean;
  exp?: ExportSchemaObject;
  ctor?: ConstructorSchemaObject;
  interfaces?: InterfaceSchemaObject[];
  inheritance?: InheritanceSchemaObject[];
  props?: PropSchemaObject[];
  methods?: MethodSchemaObject[];
  generics?: GenericSchemaObject[];
  imports?: ImportSchemaObject[];
  name: string;
  template?: string;
};

export type FunctionSchemaObject = ConfigJsonAddons & {
  exp: ExportSchemaObject;
  name: string;
  return_type: TypeInfoObject;
  is_async: boolean;
  params: ParamSchemaObject[];
  body: string;
  template: string;
  generics: GenericSchemaObject[];
};

export type TestCaseSchemaObject = ConfigJsonAddons & {
  group: string;
  name: string;
  is_async: boolean;
  id?: string;
  methods: MethodSchemaObject[];
  props: PropSchemaObject[];
  template?: string;
};

export type TestSuiteSchemaObject = ConfigJsonAddons & {
  name: string;
  id?: string;
  tests?: TestCaseSchemaObject[];
  imports?: any[];
  template?: string;
};

export type ElementSchemaObject = ConfigJsonAddons & {
  name: string;
  template?: string;
  exp?: ExportSchemaObject;
  inheritance?: InheritanceSchemaObject[];
  ctor?: ConstructorSchemaObject;
  methods?: MethodSchemaObject[];
  props?: PropSchemaObject[];
  generics?: GenericSchemaObject[];
  interfaces?: InterfaceSchemaObject[];
  imports?: ImportSchemaObject[];
  functions?: FunctionSchemaObject[];
  tests?: TestCaseSchemaObject[];
  alias?: any;
};

/**
 * JSON / user input
 */

export type ClassJson = {
  is_abstract?: boolean;
  exp?: string | boolean | ExportJson;
  ctor?: string | ConstructorJson;
  interfaces?: (string | InterfaceJson)[];
  inheritance?: (string | InheritanceJson)[];
  props?: (PropJson | string)[];
  methods?: (MethodJson | string)[];
  generics?: (GenericJson | string)[];
  imports?: (ImportJson | string)[];
  name?: string;
  id?: string;
};

export type InheritanceJson = {
  generics?: (GenericJson | string)[];
  name?: string;
};

export type InterfaceJson = {
  exp?: string | boolean | ExportJson;
  inheritance?: (string | InheritanceJson)[];
  props?: (PropJson | string)[];
  methods?: (MethodJson | string)[];
  generics?: (GenericJson | string)[];
  imports?: (ImportJson | string)[];
  name?: string;
  id?: string;
};

export type ImportJson = {
  dflt?: string;
  path?: string;
  list?: string[];
  alias?: string;
  ref_path?: string;
};
export type PropJson = {
  name?: string;
  type?: string;
  access?: string;
  is_optional?: boolean;
  is_readonly?: boolean;
  is_static?: boolean;
  value?: unknown;
};

export type ConstructorJson = {
  access?: string;
  params?: (ParamJson | string)[];
  body?: string;
  supr?: ConstructorJson;
};

export type ParamJson = {
  name?: string;
  type?: string;
  access?: string;
  is_optional?: boolean;
  is_readonly?: boolean;
  value?: unknown;
};

export type MethodJson = {
  access?: string;
  name?: string;
  return_type?: string;
  is_async?: boolean;
  is_static?: boolean;
  params?: string | (ParamJson | string)[];
  body?: string;
  supr?: MethodJson;
  generics?: (GenericJson | string)[];
  prompt?: string;
};

export type GenericJson = {
  name?: string;
  inheritance?: string; // extends types, may use multiple with & or |
  dflt?: string; // default type, may use multiple with & or |
};

export type ExportJson = {
  is_default?: boolean;
  use_wildcard?: boolean;
  path?: string;
  list?: string[];
  alias?: string;
};

export type FunctionJson = {
  exp?: string | boolean | ExportJson;
  name?: string;
  return_type?: string;
  is_async?: boolean;
  params?: (ParamJson | string)[];
  body?: string;
  generics?: (GenericJson | string)[];
};

/**
 *
 */

export type Dependency = {
  id: string;
  name: string;
  type: TypeInfoObject;
  path: string;
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

export type ApiObject = {
  controllers: ComponentData[];
  models: ComponentData[];
  entities: ComponentData[];
  mappers: ComponentData[];
  services: ComponentData[];
  collections: ComponentData[];
  routes: ComponentData[];
  route_ios: ComponentData[];
  use_cases: ComponentData[];
  repositories: ComponentData[];
  repository_impls: ComponentData[];
  repository_factories: ComponentData[];
  toolsets: ComponentData[];
  test_suites: ComponentData[];
  launcher: ComponentData;
  router: ComponentData;
  container: ComponentData;
};

/**
 * CONFIG
 */

export type ConfigJsonAddons = {
  meta?: string;
  template?: string;
};

export type InheritanceConfigJson = InheritanceJson & ConfigJsonAddons;
export type InterfaceConfigJson = InterfaceJson;
export type ConstructorConfigJson = ConstructorJson & ConfigJsonAddons;
export type PropConfigJson = PropJson & ConfigJsonAddons;
export type ImportConfigJson = ImportJson & ConfigJsonAddons;
export type GenericConfigJson = GenericJson & ConfigJsonAddons;
export type MethodConfigJson = MethodJson & ConfigJsonAddons;
export type FunctionConfigJson = FunctionJson & ConfigJsonAddons;
export type ExportConfigJson =
  | boolean
  | string
  | {
      is_default?: boolean;
    };

export type FrameworkDefaults = {
  inheritance?: InheritanceConfigJson[];
  interfaces?: InterfaceConfigJson[];
  imports?: ImportConfigJson[];
  props?: PropConfigJson[];
  methods?: MethodConfigJson[];
  functions?: FunctionConfigJson[];
  generics?: GenericConfigJson[];
  ctor?: ConstructorConfigJson;
  exp?: ExportConfigJson;
  tests?: any;
};

export type ComponentConfigJson = {
  root?: string;
  type?: string;
  name_pattern?: string;
  path_pattern?: string;
  element_type?: string; // class, abstract_class, interface, type, function
  defaults?: {
    common?: FrameworkDefaults;
    [key: string]: FrameworkDefaults;
  };
};

export type PlatformConfigJson = {
  name: string;
  alias: string;
};

export type WebFrameworkConfigJaon = {
  name: string;
  alias: string;
};

export type DatabaseMappingJson = {
  db_type: string;
  code_type: string;
};

export type DatabaseConfigJson = {
  name: string;
  alias: string;
  package?: string;
  module?: string;
  case_style?: string;
  mappings?: DatabaseMappingJson[];
};

export type ArchitectureConfigJson = {
  version: string;
  components: {
    [key: string]: ComponentConfigJson;
  };
};

export type LanguageConfigJson = {
  name: string;
  alias: string;
  types: string[];
  source_path: string;
};

export type LanguagePluginConfig = {
  version: string;
  language: LanguageConfigJson;
  architecture: ArchitectureConfigJson;
  databases: DatabaseConfigJson[];
  web_frameworks: WebFrameworkConfigJaon[];
  platforms: PlatformConfigJson[];
};

/**
 * CLI
 */

export type ProjectDescription = {
  language: string;
  database: string[];
  web_framework?: string;
  service?: string;
  source: string;
  ioc?: string;
  name?: string;
  author?: string;
  description?: string;
  license?: string;
};

/**
 * PLUGINS EXPORTS
 */
export interface TemplateModelStrategy {
  apply(
    obj: ApiObject,
    project: ProjectDescription
  ): Result<FileTemplateModel[]>;
}

export interface FileOutputStrategy {
  apply(models: FileTemplateModel[]): Promise<Result<FileOutput[]>>;
}

export interface ProjectBuildStrategy {
  apply(content: ProjectDescription): Promise<Result>;
}

export interface ProjectInitStrategy {
  apply(content: ProjectDescription): Promise<Result>;
}

export type LanguageStrategyProvider = {
  createTemplateModelStrategy: (...args: unknown[]) => TemplateModelStrategy;
  createFileOutputStrategy: (...args: unknown[]) => FileOutputStrategy;
  createProjectBuildStrategy: (
    texts: Texts,
    pluginMap: PluginMap,
    ...args: unknown[]
  ) => ProjectBuildStrategy;
  createProjectInitStrategy: (
    texts: Texts,
    pluginMap: PluginMap,
    ...args: unknown[]
  ) => ProjectInitStrategy;
};

export abstract class Strategy<T = void> {
  constructor(...args: unknown[]) {}

  public abstract apply(...args: unknown[]): T;
}
