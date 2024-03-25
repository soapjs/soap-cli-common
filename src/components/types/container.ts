import { WriteMethod } from "../../enums";
import { TypeInfo } from "../../type.info";
import {
  Component,
  ComponentElement,
  ElementWithImports,
  ElementWithMethods,
  ElementWithProps,
} from "./component";

export type ContainerElement = ElementWithImports &
  ElementWithProps &
  ElementWithMethods &
  ComponentElement;

export type BindingDescriptor = {
  class_name: string;
  default_class_name?: string;
  [key: string]: any;
};

export type RepositoryContext = {
  type: string;
  model: string;
  mapper: string;
  collection: string;
  collection_base_class: string;
  query_factory: string;
  source: string;
  table: string;
  include_source_init?: boolean;
};

export type RepositoryBindings = BindingDescriptor & {
  entity: string;
  repository_impl_class_name?: string;
  contexts: RepositoryContext[];
};

export type ServiceBindings = BindingDescriptor & {
  service_impl_class_name?: string;
};

export type ContainerAddons = {
  repositories?: RepositoryBindings[];
  use_cases?: BindingDescriptor[];
  services?: ServiceBindings[];
  toolsets?: BindingDescriptor[];
  controllers?: BindingDescriptor[];
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

  addBindings(bindings: ContainerAddons) {
    Object.keys(bindings).forEach((type) => {
      if (Array.isArray(bindings[type])) {
        this.addons[type].push(...bindings[type]);
      }
    });
  }
}
