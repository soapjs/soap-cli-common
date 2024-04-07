import { ClassJson, AdditionalData } from "../../schemas/classes";
import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ElementWithGenerics,
  ComponentElement,
  Component,
  ElementWithInterfaces,
} from "./component";
import { EntityJson } from "./entity";
import { ModelJson } from "./model";

export type MapperJson = ClassJson & {
  id?: string;
  name: string;
  types: string[];
  endpoint?: string;
  model?: string;
  entity?: string;
};

export type NewMapperJson = {
  mappers: MapperJson[];
  entities?: EntityJson[];
  models?: ModelJson[];
};

export type MapperAddons = {
  type: string;
};

export type MapperElement = ElementWithImports &
  ElementWithInterfaces &
  ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;

export type Mapper = Component<MapperElement, MapperAddons>;
