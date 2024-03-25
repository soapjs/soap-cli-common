import {
  ElementWithImports,
  ElementWithUnitTests,
  ComponentElement,
  Component,
} from "./component";

export type TestSuiteElement = ElementWithImports &
  ElementWithUnitTests &
  ComponentElement;

export type TestSuite = Component<TestSuiteElement>;
