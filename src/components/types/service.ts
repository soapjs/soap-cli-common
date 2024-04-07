import { AdditionalData, ClassData, ClassJson } from "../../schemas/classes";
import { ApiJson } from "../../types";
import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ElementWithGenerics,
  ComponentElement,
  Component,
  ElementWithInterfaces,
} from "./component";

export type ServiceJson = ClassJson & {
  endpoint?: string;
};

export type NewServiceJson = ApiJson;

export type ServiceElement = ElementWithImports &
  ElementWithInterfaces &
  ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;

export type Service = Component<ServiceElement>;
export type ServiceImpl = Component<ServiceElement>;
