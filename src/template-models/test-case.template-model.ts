import {
  MethodSchemaObject,
  PropSchemaObject,
  TestCaseSchemaObject,
} from "../types";

export class TestCaseTemplateModel {
  static create(data: TestCaseSchemaObject) {
    const { name, methods, props, group, is_async } = data;

    return new TestCaseTemplateModel(name, group, is_async, methods, props);
  }

  constructor(
    public name: string,
    public group: string,
    public is_async: boolean,
    public methods: MethodSchemaObject[],
    public props: PropSchemaObject[],
    public template?: string
  ) {}
}
