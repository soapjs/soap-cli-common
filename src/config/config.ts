import { LanguageConfig } from "./language.config";
import { ComponentsConfig } from "./components.config";
import { ComponentsConfigTools } from "../tools/components-config.tools";
import { DatabaseConfig } from "./database.config";
import { ProjectConfig } from "./project.config";
import { LanguagePluginConfig } from "../types";

export type GeneratedPath = {
  path: string;
  marker: string;
  hasDynamicFilename: boolean;
};

export type ReservedType = {
  name: string;
  category: "FrameworkDefault" | "DatabaseType" | "Primitive";
};

export class Config {
  public static create(
    pluginConfig: LanguagePluginConfig,
    projectConfig: ProjectConfig
  ): Config {
    const databases = pluginConfig.databases.map(DatabaseConfig.create);
    const language = LanguageConfig.create(pluginConfig.language);
    const components = ComponentsConfig.create(
      pluginConfig.language.source_path,
      pluginConfig.architecture.components
    );

    return new Config(projectConfig, databases, language, components);
  }

  private __allReservedTypes: ReservedType[] = [];

  constructor(
    public readonly project: ProjectConfig,
    public readonly databases: DatabaseConfig[],
    public readonly code: LanguageConfig,
    public readonly components: ComponentsConfig
  ) {
    if (Array.isArray(databases)) {
      databases.forEach((db) => {
        if (Array.isArray(db.mappings)) {
          db.mappings.forEach((mapping) =>
            this.__allReservedTypes.push({
              name: mapping.dbType,
              category: "DatabaseType",
            })
          );
        }
      });
    }

    if (Array.isArray(code.types)) {
      code.types.forEach((name) => {
        this.__allReservedTypes.push({
          name,
          category: "Primitive",
        });
      });
    }

    Object.keys(components).forEach((name) => {
      if (components[name]?.defaults) {
        ComponentsConfigTools.listTypes(components[name].defaults).forEach(
          (name) => {
            this.__allReservedTypes.push({
              name,
              category: "FrameworkDefault",
            });
          }
        );
      }
    });
  }

  get reservedTypes() {
    return [...this.__allReservedTypes];
  }
}
