import { CodeConfigJson } from "./config.types";

export class CodeConfig {
  public static create(data: CodeConfigJson): CodeConfig {
    return new CodeConfig(data.name, data.alias, data.types, data.source_dir);
  }

  constructor(
    public readonly name: string,
    public readonly alias: string,
    public readonly types: string[],
    public readonly defaultSourceDir: string
  ) {}
}
