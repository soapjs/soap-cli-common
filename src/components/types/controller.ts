import { ClassData, ClassJson, MethodJson } from "../../schemas/classes";
import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ComponentElement,
  Component,
} from "./component";

export type ControllerJson = ClassJson & {
  endpoint?: string;
  handlers?: MethodJson[];
};

export type ControllerElement = ElementWithImports &
  ElementWithProps &
  ElementWithMethods &
  ComponentElement;

export type Controller = Component<ControllerElement>;
