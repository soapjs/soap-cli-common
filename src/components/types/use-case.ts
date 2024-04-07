import {
  AdditionalData,
  ClassData,
  ClassJson,
  ParamData,
  ParamJson,
} from "../../schemas/classes";
import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ElementWithGenerics,
  ComponentElement,
  Component,
  ElementWithInterfaces,
} from "./component";

export type UseCaseJson = ClassJson & {
  input: (string | ParamJson)[];
  output?: string;
  endpoint?: string;
};

export type NewUseCaseJson = {
  use_cases: UseCaseJson[];
};

export type UseCaseElement = ElementWithImports &
  ElementWithInterfaces &
  ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;

export type UseCase = Component<UseCaseElement>;
