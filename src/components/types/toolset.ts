import { AdditionalData, ClassData, ClassJson } from "../../schemas/classes";
import { ApiJson } from "../../types";
import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ElementWithGenerics,
  ComponentElement,
  Component,
} from "./component";

export type ToolsetJson = ClassJson & {
  layer: string;
  endpoint?: string;
};

export type NewToolsetJson = ApiJson;

export type ToolsetElement = ElementWithImports &
  ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;

export type Toolset = Component<ToolsetElement>;
