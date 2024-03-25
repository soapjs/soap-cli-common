import {
  InheritanceJson,
  InterfaceJson,
  ConstructorJson,
  PropJson,
  ImportJson,
  GenericJson,
  MethodJson,
  FunctionJson,
} from "../schemas/classes";
import { ProjectDescription } from "../types";

export type ConfigJson = {
  project: ProjectDescription;
  code: CodeConfigJson;
  presets: PresetComponentsConfigJson;
  databases: DatabaseConfigJson[];
};

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
      alias?: boolean;
      use_wildcard?: boolean;
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

export type PresetComponentsConfigJson = {
  components: { [key: string]: ComponentConfigJson };
};

export type PresetConfigJson = PresetComponentsConfigJson & {
  name: string;
};

export type PlatformConfigJson = {
  name: string;
  alias: string;
  [key: string]: any;
};

export type MessageBrokerConfigJson = {
  name: string;
  alias: string;
  [key: string]: any;
};

export type WebFrameworkConfigJson = {
  name: string;
  alias: string;
  [key: string]: any;
};

export type TestFrameworkConfigJson = {
  name: string;
  alias: string;
  [key: string]: any;
};

export type AuthFrameworkConfigJson = {
  name: string;
  alias: string;
  [key: string]: any;
};

export type DocsFrameworkConfigJson = {
  name: string;
  alias: string;
  [key: string]: any;
};

export type ValidFrameworkConfigJson = {
  name: string;
  alias: string;
  [key: string]: any;
};

export type RequestCollectionConfigJson = {
  name: string;
  alias: string;
  [key: string]: any;
};

export type IoCConfigJson = {
  name: string;
  alias: string;
  [key: string]: any;
};

export type CodeConfigJson = {
  name: string;
  alias: string;
  types: string[];
  source_dir: string;
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

export type DatabaseMapping = {
  dbType: string;
  codeType: string;
};
