import {
  Collection,
  Toolset,
  Model,
  Entity,
  Mapper,
  Route,
  RouteIO,
  Controller,
  UseCase,
  Service,
  Repository,
  RepositoryImpl,
  TestSuite,
  Router,
  Container,
  Launcher,
  ServiceImpl,
  Configuration,
  RouteSchema,
  RouteModel,
} from "../../components/types";
import { Component, ComponentData } from "../../components/types/component";
import { ComponentLabel, TypeInfo } from "../../type.info";
import { ApiObject } from "../../types";

type Registry = {
  model: Model[];
  entity: Entity[];
  use_case: UseCase[];
  repository: Repository[];
  repository_impl: RepositoryImpl[];
  service: Service[];
  controller: Controller[];
  route: Route[];
  route_io: RouteIO[];
  route_schema: RouteSchema[];
  route_model: RouteModel[];
  mapper: Mapper[];
  collection: Collection[];
  service_impl: ServiceImpl[];
  toolset: Toolset[];
  test_suite: TestSuite[];
};

const isComponent = (item: any): item is Component => {
  return item && TypeInfo.isType(item.type) && item.element;
};

export class ApiSchema {
  private registry: Registry = {
    model: [],
    entity: [],
    use_case: [],
    repository: [],
    repository_impl: [],
    service: [],
    controller: [],
    route: [],
    route_io: [],
    route_schema: [],
    route_model: [],
    mapper: [],
    collection: [],
    service_impl: [],
    toolset: [],
    test_suite: [],
  };

  constructor(
    public readonly router: Router,
    public readonly container: Container,
    public readonly launcher: Launcher,
    public readonly config: Configuration
  ) {}

  add(item: Component) {
    if (this.has(item) === false) {
      this.registry[item.type.component].push(item);
    }
  }

  has(
    data:
      | Component
      | TypeInfo
      | {
          component: ComponentLabel;
          name?: string;
          ref?: string;
          type?: string;
        }
  ) {
    if (TypeInfo.isType(data)) {
      return (
        this.registry[data.component].findIndex(
          (m) =>
            (m.type.ref === data.ref || m.type.name === data.name) &&
            m.type.type === data.type
        ) > -1
      );
    }

    if (isComponent(data)) {
      return (
        this.registry[data.type.component].findIndex(
          (m) =>
            (m.type.ref === data.type.ref || m.type.name === data.type.name) &&
            m.type.type === data.type.type
        ) > -1
      );
    }

    return (
      this.registry[data.component].findIndex((m) => {
        if (data.name && m.type.name !== data.name) {
          return false;
        }
        if (data.ref && m.type.ref !== data.ref) {
          return false;
        }
        if (data.type && m.type.type !== data.type) {
          return false;
        }

        return m;
      }) > -1
    );
  }

  get(
    data:
      | TypeInfo
      | {
          component: ComponentLabel;
          name?: string;
          ref?: string;
          type?: string;
        }
  ) {
    if (TypeInfo.isType(data)) {
      return this.registry[data.component].find(
        (m) =>
          (m.type.ref === data.ref || m.type.name === data.name) &&
          m.type.type === data.type
      );
    }

    return this.registry[data.component].find((m) => {
      if (data.name && m.type.name !== data.name) {
        return false;
      }
      if (data.ref && m.type.ref !== data.ref) {
        return false;
      }
      if (data.type && m.type.type !== data.type) {
        return false;
      }

      return m;
    });
  }

  toObject(): ApiObject {
    const {
      registry: {
        model,
        entity,
        mapper,
        route,
        service,
        service_impl,
        collection,
        toolset,
        route_io,
        route_schema,
        route_model,
        controller,
        use_case,
        repository,
        repository_impl,
        test_suite,
      },
      config,
      router,
      launcher,
      container,
    } = this;

    return {
      toolsets: toolset.map((i) => i.toObject()),
      controllers: controller.map((i) => i.toObject()),
      models: model.map((i) => i.toObject()),
      entities: entity.map((i) => i.toObject()),
      mappers: mapper.map((i) => i.toObject()),
      collections: collection.map((i) => i.toObject()),
      routes: route.map((i) => i.toObject()),
      services: service.map((i) => i.toObject()),
      route_ios: route_io.map((i) => i.toObject()),
      route_schemas: route_schema.map((i) => i.toObject()),
      route_models: route_model.map((i) => i.toObject()),
      use_cases: use_case.map((i) => i.toObject()),
      repositories: repository.map((i) => i.toObject()),
      service_impls: service_impl.map((i) => i.toObject()),
      repository_impls: repository_impl.map((i) => i.toObject()),
      test_suites: test_suite.map((i) => i.toObject()),
      launcher: launcher.toObject(),
      router: router.toObject(),
      container: container.toObject(),
      config: config.toObject(),
    };
  }

  toArray<T = ComponentData>(component?: ComponentLabel): T[] {
    const { registry, config, router, launcher, container } = this;

    if (component && Array.isArray(registry[component])) {
      return registry[component].map((i) => i.toObject());
    }

    const {
      model,
      entity,
      mapper,
      route,
      service,
      service_impl,
      collection,
      toolset,
      route_io,
      route_schema,
      route_model,
      controller,
      use_case,
      repository,
      repository_impl,
      test_suite,
    } = registry;

    return [
      ...toolset.map((i) => i.toObject()),
      ...controller.map((i) => i.toObject()),
      ...model.map((i) => i.toObject()),
      ...entity.map((i) => i.toObject()),
      ...mapper.map((i) => i.toObject()),
      ...collection.map((i) => i.toObject()),
      ...route.map((i) => i.toObject()),
      ...service.map((i) => i.toObject()),
      ...route_io.map((i) => i.toObject()),
      ...route_schema.map((i) => i.toObject()),
      ...route_model.map((i) => i.toObject()),
      ...use_case.map((i) => i.toObject()),
      ...repository.map((i) => i.toObject()),
      ...service_impl.map((i) => i.toObject()),
      ...repository_impl.map((i) => i.toObject()),
      ...test_suite.map((i) => i.toObject()),
      launcher.toObject(),
      router.toObject(),
      container.toObject(),
      config.toObject(),
    ] as T[];
  }

  getAll<T = Component>(component: ComponentLabel): T {
    return this.registry[component];
  }
}
