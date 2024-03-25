import { WriteMethod } from "../../enums";
import {
  PropJson,
  GenericJson,
  AdditionalData,
  PropData,
  GenericData,
  TypeJson,
} from "../../schemas/classes";
import {
  ElementWithImports,
  ElementWithProps,
  ElementWithGenerics,
  ComponentElement,
  Component,
} from "./component";

export type ModelJson = {
  id?: string;
  name: string;
  endpoint?: string;
  types: string[];
  props?: (PropJson | string)[];
  generics?: GenericJson[];
  alias?: any;
};

export type NewModelJson = {
  models: ModelJson[];
};

export type ModelAddons = {
  modelType: string;
};

export type ModelElement = ElementWithImports &
  ElementWithProps &
  ElementWithGenerics &
  ComponentElement;

export type Model = Component<ModelElement, ModelAddons>;
