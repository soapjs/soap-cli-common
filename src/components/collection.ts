import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ElementWithGenerics,
  ComponentElement,
  Component,
} from "./component";

export type CollectionAddons = {
  storage: string;
  table: string;
  is_custom: boolean;
};

export type CollectionElement = ElementWithImports &
  ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;

export type Collection = Component<CollectionElement, CollectionAddons>;
