import { Config } from "../config";
import { WriteMethod } from "../enums";
import { TypeInfo } from "../type.info";
import {
  Component,
  ComponentElement,
  ElementWithImports,
  ElementWithMethods,
  ElementWithProps,
} from "./component";
import { Controller } from "./controller";
import { RepositoryContainer } from "./repository";
import { Service } from "./service";
import { Toolset } from "./toolset";
import { UseCase } from "./use-case";

export type ContainerElement = ElementWithImports &
  ElementWithProps &
  ElementWithMethods &
  ComponentElement;

export type RepositoryContext = {
  type: string;
  model: string;
  mapper: string;
  collection: string;
  table: string;
};

export type RepositoryBindings = {
  repository: string;
  impl: string;
  entity: string;
  contexts: RepositoryContext[];
};

export type ServiceBindings = { service: string; impl: string };
export type UseCaseBindings = { use_case: string };
export type ToolsetBindings = { toolset: string };
export type ControllerBindings = { controller: string };

export type ContainerAddons = {
  repositories: RepositoryBindings[];
  use_cases: UseCaseBindings[];
  services: ServiceBindings[];
  toolsets: ToolsetBindings[];
  controllers: ControllerBindings[];
};

export class Container extends Component<ContainerElement, ContainerAddons> {
  constructor(
    public readonly id: string,
    public readonly type: TypeInfo,
    public readonly path: string,
    public readonly writeMethod: WriteMethod,
    public readonly addons: ContainerAddons,
    public readonly element: ContainerElement
  ) {
    super(id, type, "", path, writeMethod, addons, element);
  }

  addRepositoryBindings(container: RepositoryContainer, config: Config) {
    const bindings: RepositoryBindings = {
      repository: container.repository.type.name,
      impl: "",
      entity: container.entity.type.name,
      contexts: [],
    };
    this.addDependency(container.repository, config);
    this.addDependency(container.entity, config);

    if (container.impl) {
      this.addDependency(container.impl, config);
      bindings.impl = container.impl.type.name;
    }

    container.contexts.forEach((context) => {
      const ctx: any = {
        type: context.model.type.type,
        model: context.model.type.name,
      };
      this.addDependency(context.model, config);

      if (context.mapper) {
        ctx.mapper = context.mapper.type.name;
        this.addDependency(context.mapper, config);
      }

      if (context.collection) {
        ctx.table = context.collection.addons.table;
        if (context.collection.addons.is_custom) {
          ctx.collection = context.collection.type.name;
          this.addDependency(context.collection, config);
        }
      }

      bindings.contexts.push(ctx);
    });

    this.addons.repositories.push(bindings);
  }

  addServiceBindings(item: Service, config: Config) {
    this.addDependency(item, config);
    this.addons.services.push({ service: item.type.name, impl: "" });
  }

  addUseCaseBindings(item: UseCase, config: Config) {
    this.addDependency(item, config);
    this.addons.use_cases.push({ use_case: item.type.name });
  }

  addControllerBindings(item: Controller, config: Config) {
    this.addDependency(item, config);
    this.addons.controllers.push({ controller: item.type.name });
  }

  addToolsetBindings(item: Toolset, config: Config) {
    this.addDependency(item, config);
    this.addons.toolsets.push({ toolset: item.type.name });
  }
}
