import { ImportSchemaObject } from "../types";

export class ImportTemplateModel {
  static create(data: ImportSchemaObject) {
    const { dflt, path, list, alias } = data;
    return new ImportTemplateModel(dflt, path, list || [], alias);
  }

  constructor(
    public dflt: string,
    public path: string,
    public list: string[],
    public alias: string
  ) {}
}
