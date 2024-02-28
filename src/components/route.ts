import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ElementWithGenerics,
  ComponentElement,
  Component,
} from "./component";

export type RouteElement = ElementWithImports &
  ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;

export type RouteModelElement = ElementWithImports &
  ElementWithProps &
  ElementWithGenerics &
  ComponentElement;

export type RouteModelAddons = {
  modelType: string;
};

export type Route = Component<RouteElement>;
export type RouteModel = Component<RouteModelElement, RouteModelAddons>;
export type RouteIO = Component<RouteElement>;
