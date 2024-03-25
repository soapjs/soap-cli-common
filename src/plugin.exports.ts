import { PluginConfig } from "./config";
import { FileDescriptor } from "./file-output";
import { PluginMap } from "./config/plugin-map";
import { Result } from "./result";
import { FileTemplateModel } from "./template-models";
import { Texts } from "./texts";
import { ApiObject, ProjectDescription } from "./types";

export interface TemplateModelStrategy {
  apply(
    obj: ApiObject,
    project: ProjectDescription
  ): Result<FileTemplateModel[]>;
}

export interface FileOutputStrategy {
  apply(models: FileTemplateModel[]): Promise<Result<FileDescriptor[]>>;
}

export interface ProjectBuildStrategy {
  apply(content: ProjectDescription): Promise<Result>;
}

export interface ProjectInitStrategy {
  apply(content: ProjectDescription): Promise<Result>;
}

export type TemplateSchemaMap = { [key: string]: string };

export type PluginFacade = {
  createTemplateModels: (
    obj: ApiObject,
    project: ProjectDescription,
    ...args: unknown[]
  ) => Result<FileTemplateModel[]>;
  createFileDescriptors: (
    models: FileTemplateModel[],
    templates: TemplateSchemaMap,
    project: ProjectDescription,
    ...args: unknown[]
  ) => Promise<Result<FileDescriptor[]>>;
  buildProject: (
    texts: Texts,
    pluginMap: PluginMap,
    templates: TemplateSchemaMap,
    content: ProjectDescription,
    ...args: unknown[]
  ) => Promise<Result>;
  initProject: (
    texts: Texts,
    pluginMap: PluginMap,
    templates: TemplateSchemaMap,
    content: ProjectDescription,
    ...args: unknown[]
  ) => Promise<Result>;
  setupTemplates: (
    project: ProjectDescription
  ) => Promise<Result<TemplateSchemaMap>>;

  default_config: PluginConfig;
};
