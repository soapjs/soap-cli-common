import { ProjectDescription } from "../types";

export class ProjectConfig {
  static create(project: ProjectDescription) {
    const {
      language,
      database,
      web_framework,
      messaging,
      preset,
      test_framework,
      auth_framework,
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
      platform,
      source_dir,
      ioc,
      preset,
      messaging,
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
    public readonly platform: string,
    public readonly source_dir: string,
    public readonly ioc: string,
    public readonly preset: string,
    public readonly messaging: string,
    public readonly name: string,
    public readonly author: string,
    public readonly description: string,
    public readonly license: string
  ) {}
}
