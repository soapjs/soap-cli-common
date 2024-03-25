import {
  ElementWithImports,
  ElementWithProps,
  ElementWithFunctions,
  ComponentElement,
  Component,
} from "./component";

export type LauncherElement = ElementWithImports &
  ElementWithProps &
  ElementWithFunctions &
  ComponentElement;

export type Launcher = Component<LauncherElement>;
