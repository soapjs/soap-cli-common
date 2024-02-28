import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ComponentElement,
  Component,
} from "./component";

export type ControllerElement = ElementWithImports &
  ElementWithProps &
  ElementWithMethods &
  ComponentElement;

export type Controller = Component<ControllerElement>;
