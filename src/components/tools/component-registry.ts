import {
  Model,
  Entity,
  Collection,
  UseCase,
  Repository,
  RepositoryImpl,
  Service,
  Controller,
  Route,
  RouteIO,
  RouteSchema,
  RouteModel,
  Mapper,
  ServiceImpl,
  Toolset,
  TestSuite,
  Component,
} from "..";
import { TypeInfo, ComponentLabel } from "../../type.info";

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

export class ComponentRegistry {
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

  add(...data: Component[]) {
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (this.has(item) === false) {
          this.registry[item.type.component].push(item);
        }
      });
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

  get models() {
    return this.registry.model;
  }
  get entities() {
    return this.registry.entity;
  }
  get use_cases() {
    return this.registry.use_case;
  }
  get repositories() {
    return this.registry.repository;
  }
  get repository_impls() {
    return this.registry.repository_impl;
  }
  get services() {
    return this.registry.service;
  }
  get controllers() {
    return this.registry.controller;
  }
  get routes() {
    return this.registry.route;
  }
  get route_ios() {
    return this.registry.route_io;
  }
  get route_schemas() {
    return this.registry.route_schema;
  }
  get route_models() {
    return this.registry.route_model;
  }
  get mappers() {
    return this.registry.mapper;
  }
  get collections() {
    return this.registry.collection;
  }
  get service_impls() {
    return this.registry.service_impl;
  }
  get toolsets() {
    return this.registry.toolset;
  }
  get test_suites() {
    return this.registry.test_suite;
  }

  toArray(): Component[] {
    const { registry } = this;
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
      ...toolset,
      ...controller,
      ...model,
      ...entity,
      ...mapper,
      ...collection,
      ...route,
      ...service,
      ...route_io,
      ...route_schema,
      ...route_model,
      ...use_case,
      ...repository,
      ...service_impl,
      ...repository_impl,
      ...test_suite,
    ];
  }
}
