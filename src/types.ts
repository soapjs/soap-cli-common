import {
  ModelJson,
  EntityJson,
  MapperJson,
  CollectionJson,
  ServiceJson,
  UseCaseJson,
  RepositoryJson,
  RouteJson,
  ControllerJson,
  ToolsetJson,
  ComponentData,
  RouterAddons,
  ContainerAddons,
  ConfigAddons,
} from "./components/types";

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

export type ApiObject = {
  controllers: ComponentData[];
  models: ComponentData[];
  entities: ComponentData[];
  mappers: ComponentData[];
  services: ComponentData[];
  collections: ComponentData[];
  routes: ComponentData[];
  route_ios: ComponentData[];
  route_schemas: ComponentData[];
  route_models: ComponentData[];
  use_cases: ComponentData[];
  repositories: ComponentData[];
  repository_impls: ComponentData[];
  service_impls: ComponentData[];
  toolsets: ComponentData[];
  test_suites: ComponentData[];
  launcher: ComponentData;
  router: ComponentData<any, RouterAddons>;
  container: ComponentData<any, ContainerAddons>;
  config: ComponentData<any, ConfigAddons>;
};

export type ProjectDescription = {
  language: string;
  database: string[];
  web_framework?: string;
  test_framework?: string;
  auth_framework?: string;
  valid_framework?: string;
  docs_framework?: string;
  request_collection_format?: string;
  message_broker?: string;
  preset?: string;
  platform?: string;
  source_dir?: string;
  ioc?: string;
  name?: string;
  author?: string;
  description?: string;
  license?: string;
};
export abstract class Strategy<T = void> {
  constructor(...args: unknown[]) {}

  public abstract apply(...args: unknown[]): T;
}
