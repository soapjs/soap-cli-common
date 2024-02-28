import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ElementWithGenerics,
  ComponentElement,
  Component,
} from "./component";

export type ServiceElement = ElementWithImports &
  ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;

export type Service = Component<ServiceElement>;
