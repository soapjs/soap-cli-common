import { ExportSchemaObject } from "../types";

export class ExportTemplateModel {
  static create(data: ExportSchemaObject) {
    const { is_default, use_wildcard, path, list, alias } = data;
    return new ExportTemplateModel(
      is_default,
      use_wildcard,
      path,
      list || [],
      alias
    );
  }

  constructor(
    public is_default: boolean,
    public use_wildcard: boolean,
    public path: string,
    public list: string[],
    public alias: string
  ) {}
}
