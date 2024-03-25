import { ClassJson, ClassData } from "../../schemas/classes";
import { Collection, CollectionJson } from "./collection";
import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ElementWithGenerics,
  ComponentElement,
  Component,
} from "./component";
import { EntityJson } from "./entity";
import { Mapper, MapperJson } from "./mapper";
import { Model, ModelJson } from "./model";

export type DataContextCollectionJson = {
  name: string;
  impl?: boolean;
  table?: string;
};

export type DataContextJson = {
  type: string;
  model?: string;
  collection?: DataContextCollectionJson;
  mapper?: string;
};

export type RepositoryJson = ClassJson & {
  name: string;
  entity: string;
  impl?: boolean;
  endpoint?: string;
  contexts?: (DataContextJson | string)[];
};

export type NewRepositoryJson = {
  repositories: RepositoryJson[];
  models?: ModelJson[];
  entities?: EntityJson[];
  sources?: CollectionJson[];
  mappers?: MapperJson[];
};

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
