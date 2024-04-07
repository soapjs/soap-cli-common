import { AdditionalData, ClassData, ClassJson } from "../../schemas/classes";
import { ApiJson } from "../../types";
import {
  Component,
  ComponentElement,
  ElementWithGenerics,
  ElementWithImports,
  ElementWithInterfaces,
  ElementWithMethods,
  ElementWithProps,
} from "./component";

export type EntityJson = ClassJson & {
  endpoint?: string;
  has_model?: boolean;
};

export type NewEntityJson = ApiJson;

export type EntityAddons = {
  hasModel: boolean;
};
export type EntityElement = ElementWithImports &
  ElementWithInterfaces &
  ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;
export type Entity = Component<EntityElement, EntityAddons>;
