import { AdditionalData, ClassData, ClassJson } from "../../schemas/classes";
import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ElementWithGenerics,
  ComponentElement,
  Component,
  ElementWithInterfaces,
} from "./component";

export type CollectionJson = ClassJson & {
  id?: string;
  name: string;
  types: string[];
  table?: string;
  endpoint?: string;
  model?: string;
};

export type NewCollectionJson = {
  collections: CollectionJson[];
};

export type CollectionAddons = {
  type: string;
  table: string;
  is_custom: boolean;
};

export type CollectionElement = ElementWithImports &
  ElementWithInterfaces &
  ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;

export type Collection = Component<CollectionElement, CollectionAddons>;
