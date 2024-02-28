import {
  ElementWithImports,
  ElementWithProps,
  ElementWithGenerics,
  ComponentElement,
  Component,
} from "./component";

export type ModelAddons = {
  modelType: string;
};

export type ModelElement = ElementWithImports &
  ElementWithProps &
  ElementWithGenerics &
  ComponentElement;

export type Model = Component<ModelElement, ModelAddons>;
