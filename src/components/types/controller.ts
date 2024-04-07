import { ClassData, ClassJson, MethodJson } from "../../schemas/classes";
import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ComponentElement,
  Component,
  ElementWithInterfaces,
} from "./component";

export type ControllerJson = ClassJson & {
  endpoint?: string;
  handlers?: MethodJson[];
};

export type ControllerElement = ElementWithImports &
  ElementWithInterfaces &
  ElementWithProps &
  ElementWithMethods &
  ComponentElement;

export type Controller = Component<ControllerElement>;
