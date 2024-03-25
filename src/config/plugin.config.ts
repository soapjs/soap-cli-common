import {
  CodeConfigJson,
  PresetConfigJson,
  DatabaseConfigJson,
  WebFrameworkConfigJson,
  PlatformConfigJson,
  MessageBrokerConfigJson,
  AuthFrameworkConfigJson,
  IoCConfigJson,
  DocsFrameworkConfigJson,
  ValidFrameworkConfigJson,
  RequestCollectionConfigJson,
} from "./config.types";

export type PluginConfig = {
  version: string;
  code: CodeConfigJson;
  presets: PresetConfigJson[];
  databases: DatabaseConfigJson[];
  web_frameworks: WebFrameworkConfigJson[];
  platforms: PlatformConfigJson[];
  message_brokers: MessageBrokerConfigJson[];
  test_frameworks: WebFrameworkConfigJson[];
  auth_frameworks: AuthFrameworkConfigJson[];
  docs_frameworks: DocsFrameworkConfigJson[];
  valid_frameworks: ValidFrameworkConfigJson[];
  request_collections: RequestCollectionConfigJson[];
  ioc: IoCConfigJson[];
};
