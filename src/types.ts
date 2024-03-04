import { FileDescriptor } from "./file-output";
import { PluginMap } from "./plugin-map";
import { Result } from "./result";
import { ClassData } from "./schemas";
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
 * COMPONENTS
 */

export type EntityJson = ClassJson & {
  endpoint?: string;
  has_model?: boolean;
};
export type EntityData = EntityJson;
export type NewEntityJson = ApiJson;

export type HandlerJson = {
  name: string;
  input?: any;
  output?: any;
};

export type ControllerJson = ClassJson & {
  name: string;
  endpoint?: string;
  handlers?: HandlerJson[];
};
export type ControllerData = ClassJson & {
  name: string;
  endpoint?: string;
  handlers?: {
    name: string;
    input?: string;
    output?: string;
    prompt?: string;
  }[];
};

export type MapperJson = ClassJson & {
  id?: string;
  name: string;
  storages: string[];
  endpoint?: string;
  model?: string;
  entity?: string;
};

export type MapperData = ClassData & {
  id?: string;
  name: string;
  storage: string;
  endpoint?: string;
};

export type NewMapperJson = {
  mappers: MapperJson[];
  entities?: EntityJson[];
  models?: ModelJson[];
};

export type ModelJson = {
  id?: string;
  name: string;
  endpoint?: string;
  types: string[];
  props?: (PropJson | string)[];
  generics?: GenericJson[];
  alias?: any;
};

export type ModelData = {
  id?: string;
  name: string;
  endpoint?: string;
  type: string;
  props?: (PropJson | string)[];
  generics?: GenericJson[];
  alias?: any;
};

export type NewModelJson = {
  models: ModelJson[];
};

export type DataContextCollectionJson = {
  name: string;
  impl?: boolean;
  table?: string;
};

export type DataContextJson = {
  type: string;
  model?: string;
  collection?: DataContextCollectionJson;
  mapper?: string;
};

export type RepositoryJson = ClassJson & {
  name: string;
  entity: string;
  impl?: boolean;
  endpoint?: string;
  contexts?: (DataContextJson | string)[];
};

export type RepositoryData = ClassData & {
  endpoint?: string;
  is_custom?: boolean;
};

export type NewRepositoryJson = {
  repositories: RepositoryJson[];
  models?: ModelJson[];
  entities?: EntityJson[];
  sources?: CollectionJson[];
  mappers?: MapperJson[];
};

export type RouteRequestJson = {
  method: string;
  path: string; // includes query_params and path_params
  headers?: { [key: string]: any };
  body?: any;
  validate?: boolean;
  auth?: string;
};

export type RouteResponseJson = {
  [code: number]: any;
};

export type RouteHandlerJson = {
  controller: string; // name/id
  name: string; // name
  input?: string; // model/entity name
  output?: string; // entity name
};

export type RouteJson = ClassJson & {
  id?: string;
  name: string;
  controller: string;
  handler: string;
  endpoint?: string;
  request: RouteRequestJson;
  response?: string | RouteResponseJson;
};

export type RouteData = RouteJson;

export type RouteModelJson = {
  method: string;
  name: string;
  endpoint?: string;
  types: string[];
  props?: (PropJson | string)[];
  generics?: GenericJson[];
};

export type RouteModelData = {
  method: string;
  name: string;
  endpoint?: string;
  type: string;
  alias?: any;
  props?: (PropJson | string)[];
  generics?: GenericJson[];
};

export type CollectionJson = ClassJson & {
  id?: string;
  name: string;
  storages: string[];
  table?: string;
  endpoint?: string;
  model?: string;
};

export type CollectionData = ClassData & {
  name: string;
  table: string;
  storage: string;
  endpoint?: string;
  is_custom?: boolean;
};

export type NewCollectionJson = {
  collections: CollectionJson[];
};
export type ToolsetJson = ClassJson & {
  layer: string;
  endpoint?: string;
};

export type ToolsetData = ToolsetJson;

export type NewToolsetJson = ApiJson;

export type UseCaseJson = ClassJson & {
  name: string;
  input: (string | ParamJson)[];
  output?: string;
  endpoint?: string;
};

export type UseCaseData = UseCaseJson;

export type NewUseCaseJson = {
  use_cases: UseCaseJson[];
};

export type ServiceJson = ClassJson & {
  endpoint?: string;
};

export type ServiceData = ServiceJson;

export type NewServiceJson = ApiJson;

export type ApiJson = {
  models?: ModelJson[];
  entities?: EntityJson[];
  mappers?: MapperJson[];
  collections?: CollectionJson[];
  services?: ServiceJson[];
  use_cases?: UseCaseJson[];
  repositories?: RepositoryJson[];
  routes?: RouteJson[];
  controllers?: ControllerJson[];
  toolsets?: ToolsetJson[];
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

export type MessagingConfigJson = {
  name: string;
  alias: string;
};

export type WebFrameworkConfigJaon = {
  name: string;
  alias: string;
};

export type TestFrameworkConfigJaon = {
  name: string;
  alias: string;
};

export type AuthFrameworkConfigJaon = {
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

export type PresetConfigJson = {
  [key: string]: ComponentConfigJson;
};

export type ArchitectureConfigJson = {
  version: string;
  components: PresetConfigJson;
};

export type LanguageConfigJson = {
  name: string;
  alias: string;
  types: string[];
  source_dir: string;
};

export type LanguagePluginConfig = {
  version: string;
  language: LanguageConfigJson;
  architecture: ArchitectureConfigJson;
  databases: DatabaseConfigJson[];
  web_frameworks: WebFrameworkConfigJaon[];
  platforms: PlatformConfigJson[];
  messaging: MessagingConfigJson[];
  test_frameworks: WebFrameworkConfigJaon[];
  auth_frameworks: AuthFrameworkConfigJaon[];
};

/**
 * CLI
 */

export type ProjectDescription = {
  language: string;
  database: string[];
  web_framework?: string;
  test_framework?: string;
  auth_framework?: string;
  messaging?: string;
  preset?: string;
  platform?: string;
  source_dir?: string;
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
  apply(models: FileTemplateModel[]): Promise<Result<FileDescriptor[]>>;
}

export interface ProjectBuildStrategy {
  apply(content: ProjectDescription): Promise<Result>;
}

export interface ProjectInitStrategy {
  apply(content: ProjectDescription): Promise<Result>;
}

export abstract class Strategy<T = void> {
  constructor(...args: unknown[]) {}

  public abstract apply(...args: unknown[]): T;
}

export type LanguagePluginFacade = {
  createTemplateModels: (
    obj: ApiObject,
    project: ProjectDescription,
    ...args: unknown[]
  ) => Result<FileTemplateModel[]>;
  createFileDescriptors: (
    models: FileTemplateModel[],
    ...args: unknown[]
  ) => Promise<Result<FileDescriptor[]>>;
  buildProject: (
    texts: Texts,
    pluginMap: PluginMap,
    content: ProjectDescription,
    ...args: unknown[]
  ) => Promise<Result>;
  initProject: (
    texts: Texts,
    pluginMap: PluginMap,
    content: ProjectDescription,
    ...args: unknown[]
  ) => Promise<Result>;
};
