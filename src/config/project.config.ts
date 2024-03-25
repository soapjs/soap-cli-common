import { ProjectDescription } from "../types";

export class ProjectConfig {
  static create(project: ProjectDescription) {
    const {
      language,
      database,
      web_framework,
      message_broker,
      preset,
      test_framework,
      auth_framework,
      valid_framework,
      docs_framework,
      request_collection_format,
      platform,
      source_dir,
      ioc,
      name,
      author,
      description,
      license,
    } = project;
    return new ProjectConfig(
      language,
      database,
      web_framework,
      test_framework,
      auth_framework,
      valid_framework,
      docs_framework,
      request_collection_format,
      platform,
      source_dir,
      ioc,
      preset,
      message_broker,
      name,
      author,
      description,
      license
    );
  }

  constructor(
    public readonly language: string,
    public readonly database: string[],
    public readonly web_framework: string,
    public readonly test_framework: string,
    public readonly auth_framework: string,
    public readonly valid_framework: string,
    public readonly docs_framework: string,
    public readonly request_collection_format: string,
    public readonly platform: string,
    public readonly source_dir: string,
    public readonly ioc: string,
    public readonly preset: string,
    public readonly message_broker: string,
    public readonly name: string,
    public readonly author: string,
    public readonly description: string,
    public readonly license: string
  ) {}
}
