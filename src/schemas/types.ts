import { ConfigJsonAddons } from "../config";
import { WriteMethod } from "../enums";
import { TypeInfo, TypeInfoObject } from "../type.info";
import { MethodSchema } from "./classes/method.schema";
import { PropSchema } from "./classes/prop.schema";

export type AdditionalData = {
  write_method: WriteMethod;
  rank: number;
};

export type AdditionalJson = {
  write_method?: WriteMethod;
  rank?: number;
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
  decorators?: DecoratorSchemaObject[];
  tests?: TestCaseSchemaObject[];
  alias?: any;
};

export type ClassJson = AdditionalJson & {
  is_abstract?: boolean;
  exp?: string | boolean | ExportJson;
  ctor?: string | ConstructorJson;
  interfaces?: (string | InterfaceJson)[];
  inheritance?: (string | InheritanceJson)[];
  decorators?: DecoratorJson[];
  props?: (PropJson | string)[];
  methods?: (MethodJson | string)[];
  generics?: (GenericJson | string)[];
  imports?: (ImportJson | string)[];
  name?: string;
  id?: string;
};

export type ClassData = AdditionalData & {
  is_abstract?: boolean;
  exp?: ExportData;
  ctor?: ConstructorData;
  interfaces?: InterfaceData[];
  inheritance?: InheritanceData[];
  props?: PropData[];
  methods?: MethodData[];
  generics?: GenericData[];
  imports?: ImportData[];
  name: string;
  id?: string;
  template?: string;
  decorators?: DecoratorData[];
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
  decorators?: DecoratorSchemaObject[];
};

export type ConstructorJson = {
  access?: string;
  params?: (ParamJson | string)[];
  body?: string;
  supr?: ConstructorJson;
  decorators?: DecoratorJson[];
};

export type ConstructorSchemaObject = ConfigJsonAddons & {
  access: string;
  params: ParamSchemaObject[];
  body: string;
  template: string;
  supr: ConstructorSchemaObject;
  decorators?: DecoratorSchemaObject[];
};

export type ConstructorData = {
  access?: string;
  params?: ParamData[];
  body?: string;
  template?: string;
  supr?: ConstructorData;
  meta?: any;
};

export type SourceFileData = {
  exp?: ExportData;
  props?: PropData[];
  functions?: FunctionData[];
  imports?: ImportData[];
  name: string;
  id?: string;
  template?: string;
};

export type ExportJson = {
  is_default?: boolean;
  use_wildcard?: boolean;
  path?: string;
  list?: string[];
  alias?: string;
};
export type ExportSchemaObject = ConfigJsonAddons & {
  is_default?: boolean;
  use_wildcard?: boolean;
  path?: string;
  list?: string[];
  alias?: string;
};

export type ExportData = {
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
  decorators?: DecoratorJson[];
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
  decorators?: DecoratorSchemaObject[];
};

export type FunctionData = {
  exp?: ExportData;
  name?: string;
  return_type?: TypeInfo;
  is_async?: boolean;
  params?: ParamData[];
  body?: string;
  template?: string;
  generics?: GenericData[];
  meta?: any;
  decorators?: DecoratorData[];
};

export type GenericJson = {
  name?: string;
  inheritance?: string; // extends types, may use multiple with & or |
  dflt?: string; // default type, may use multiple with & or |
};

export type GenericSchemaObject = ConfigJsonAddons & {
  name: string;
  inheritance: InheritanceSchemaObject;
  dflt: string;
};

export type GenericData = {
  name?: string;
  inheritance?: InheritanceData; // extends types, may use multiple with & or |
  dflt?: string; // default type, may use multiple with & or |
  meta?: any;
};

export type ImportJson = {
  dflt?: string;
  path?: string;
  list?: string[];
  alias?: string;
  ref_path?: string;
};

export type ImportSchemaObject = ConfigJsonAddons & {
  dflt: string;
  path: string;
  list: string[];
  alias: string;
  [key: string]: any;
};

export type ImportData = {
  dflt?: string;
  path?: string;
  ref_path?: string;
  list?: string[];
  alias?: string;
  meta?: string;
};

export type InheritanceJson = {
  generics?: (GenericJson | string)[];
  name?: string;
};

export type InheritanceSchemaObject = ConfigJsonAddons & {
  generics: GenericSchemaObject[];
  name: string;
};

export type InheritanceData = {
  generics?: GenericData[];
  name?: string;
  meta?: any;
};

export type InterfaceJson = AdditionalJson & {
  exp?: string | boolean | ExportJson;
  inheritance?: (string | InheritanceJson)[];
  props?: (PropJson | string)[];
  methods?: (MethodJson | string)[];
  generics?: (GenericJson | string)[];
  imports?: (ImportJson | string)[];
  name?: string;
  id?: string;
  decorators?: DecoratorJson[];
};

export type InterfaceSchemaObject = ConfigJsonAddons & {
  exp?: ExportSchemaObject;
  inheritance?: InheritanceSchemaObject[];
  props?: PropSchemaObject[];
  methods?: MethodSchemaObject[];
  generics?: GenericSchemaObject[];
  imports?: ImportSchemaObject[];
  decorators?: DecoratorSchemaObject[];
  name: string;
};

export type InterfaceData = AdditionalData & {
  exp?: ExportData;
  inheritance?: InheritanceData[];
  props: PropData[];
  methods: MethodData[];
  generics?: GenericData[];
  imports?: ImportData[];
  name: string;
  id?: string;
  meta?: string;
  decorators?: DecoratorData[];
};

export type MethodJson = {
  access?: string;
  name?: string;
  return_type?: string;
  is_async?: boolean;
  is_static?: boolean;
  params?: (ParamJson | string)[];
  body?: string;
  supr?: MethodJson;
  generics?: (GenericJson | string)[];
  prompt?: string;
  decorators?: DecoratorJson[];
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
  decorators?: DecoratorSchemaObject[];
};

export type MethodData = {
  access?: string;
  name?: string;
  return_type?: TypeInfo;
  is_async?: boolean;
  is_static?: boolean;
  params?: ParamData[];
  body?: string;
  template?: string;
  supr?: MethodData;
  generics?: GenericData[];
  meta?: any;
  decorators?: DecoratorData[];
};

export type ParamJson = {
  name?: string;
  type?: string;
  access?: string;
  is_optional?: boolean;
  is_readonly?: boolean;
  value?: unknown;
  decorators?: DecoratorJson[];
};

export type ParamSchemaObject = ConfigJsonAddons & {
  name: string;
  type: TypeInfoObject;
  access: string;
  is_optional: boolean;
  is_readonly: boolean;
  value: any;
  template?: string;
  decorators?: DecoratorSchemaObject[];
};

export type ParamData = {
  name?: string;
  type?: TypeInfo;
  access?: string;
  is_optional?: boolean;
  is_readonly?: boolean;
  value?: unknown;
  template?: string;
  meta?: string;
  decorators?: DecoratorData[];
};

export type DecoratorJson = {
  name: string;
  args?: any[];
};
export type DecoratorData = DecoratorJson;
export type DecoratorSchemaObject = DecoratorJson;

export type PropSchemaObject = ConfigJsonAddons & {
  name: string;
  type: TypeInfoObject;
  access: string;
  is_optional: boolean;
  is_readonly: boolean;
  is_static: boolean;
  value: any;
  template: string;
  decorators?: DecoratorSchemaObject[];
};

export type PropData = {
  name?: string;
  type?: TypeInfo;
  access?: string;
  is_optional?: boolean;
  is_readonly?: boolean;
  is_static?: boolean;
  value?: unknown;
  template?: string;
  meta?: string;
  decorators?: DecoratorData[];
};

export type PropJson = {
  name?: string;
  type?: string;
  access?: string;
  is_optional?: boolean;
  is_readonly?: boolean;
  is_static?: boolean;
  value?: unknown;
  decorators?: DecoratorJson[];
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

export type TestGroupData = {
  name: string;
  is_async?: boolean;
};

export type TestCaseData = {
  group: TestGroupData;
  name: string;
  is_async: boolean;
  prompt?: string;
  methods?: MethodSchema[];
  props?: PropSchema[];
  template?: string;
};

export type TestSuiteData = {
  name: string;
  is_async?: boolean;
  type: "unit_tests" | string; //temp soultion
  endpoint?: string;
  template?: string;
  id?: string;
  [key: string]: any;
};

export type TypeSchemaObject = ConfigJsonAddons & {
  exp?: ExportSchemaObject;
  name: string;
  props?: PropSchemaObject[];
  generics?: GenericSchemaObject[];
  alias?: any;
  imports?: ImportSchemaObject[];
};

export type TypeData = AdditionalData & {
  id?: string;
  exp?: ExportData;
  name?: string;
  props?: PropData[];
  type?: TypeInfo;
  generics?: GenericData[];
  imports?: ImportData[];
  alias?: any;
  meta?: any;
};

export type TypeObject = ConfigJsonAddons & {
  exp?: ExportSchemaObject;
  name: string;
  props?: PropSchemaObject[];
  generics?: GenericSchemaObject[];
  alias?: any;
  imports?: ImportSchemaObject[];
};

export type TypeJson = AdditionalJson & {
  id?: string;
  exp?: string | boolean | ExportJson;
  name?: string;
  props?: (PropJson | string)[];
  type: string;
  generics?: GenericJson[];
  imports?: ImportJson[];
  alias?: any;
};

export type TypeConfig = TypeJson & ConfigJsonAddons;
