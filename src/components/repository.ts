import { Collection } from "./collection";
import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ElementWithGenerics,
  ComponentElement,
  Component,
} from "./component";
import { Entity } from "./entity";
import { Mapper } from "./mapper";
import { Model } from "./model";

export type RepositoryElement = ElementWithImports &
  ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;

export type Repository = Component<RepositoryElement>;
export type RepositoryImpl = Component<RepositoryElement>;
export type DataContext = {
  model: Model;
  collection?: Collection;
  mapper?: Mapper;
};

export type RepositoryContainer = {
  repository: Repository;
  entity: Entity;
  impl: RepositoryImpl;
  contexts: DataContext[];
};