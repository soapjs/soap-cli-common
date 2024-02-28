import {
  Component,
  ComponentElement,
  ElementWithGenerics,
  ElementWithImports,
  ElementWithMethods,
  ElementWithProps,
} from "./component";

export type EntityAddons = {
  hasModel: boolean;
};
export type EntityElement = ElementWithImports &
  ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;
export type Entity = Component<EntityElement, EntityAddons>;
