import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ComponentElement,
  Component,
} from "./component";

export type ConfigElement = ElementWithImports &
  ElementWithProps &
  ElementWithMethods &
  ComponentElement;

export type ConfigAddons = any;

export type Configuration = Component<ConfigElement, ConfigAddons>;
