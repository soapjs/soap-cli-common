import { TestSuiteSchemaObject } from "../types";
import { ImportTemplateModel } from "./import.template-model";
import { TestCaseTemplateModel } from "./test-case.template-model";

export class TestSuiteTemplateModel {
  static create(data: TestSuiteSchemaObject) {
    const { imports, name, tests, template } = data;

    return new TestSuiteTemplateModel(
      name,
      Array.isArray(tests)
        ? tests.map((i) => TestCaseTemplateModel.create(i))
        : [],
      Array.isArray(imports)
        ? imports.map((i) => ImportTemplateModel.create(i))
        : [],
      template
    );
  }

  constructor(
    public name: string,
    public tests: TestCaseTemplateModel[],
    public imports: ImportTemplateModel[],
    public template: string
  ) {}
}
