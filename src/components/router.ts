import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ComponentElement,
  Component,
} from "./component";

export type RouterElement = ElementWithImports &
  ElementWithProps &
  ElementWithMethods &
  ComponentElement;

export type Router = Component<
  RouterElement,
  { routes: { path: string; controller: string; handler: string }[] }
>;
