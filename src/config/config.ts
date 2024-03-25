import { CodeConfig } from "./code.config";
import { PresetsConfig } from "./presets.config";
import { ComponentsConfigTools } from "./tools/components-config.tools";
import { DatabaseConfig } from "./database.config";
import { ProjectConfig } from "./project.config";
import { ConfigJson, PresetConfigJson } from "./config.types";
import { PluginConfig } from "./plugin.config";

export type GeneratedPath = {
  path: string;
  marker: string;
  hasDynamicFilename: boolean;
};

export type ReservedType = {
  name: string;
  category: string; // "FrameworkDefault" | "DatabaseType" | "Primitive"
};

export class Config {
  public static create(json: ConfigJson): Config {
    const project = ProjectConfig.create(json.project);
    const databases = json.databases.map(DatabaseConfig.create);
    const code = CodeConfig.create(json.code);
    const components = PresetsConfig.create(
      project.source_dir || code.defaultSourceDir,
      json.presets
    );

    return new Config(project, databases, code, components);
  }

  private __allReservedTypes: ReservedType[] = [];

  constructor(
    public readonly project: ProjectConfig,
    public readonly databases: DatabaseConfig[],
    public readonly code: CodeConfig,
    public readonly presets: PresetsConfig
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

    Object.keys(presets).forEach((name) => {
      if (presets[name]?.defaults) {
        ComponentsConfigTools.listTypes(presets[name].defaults).forEach(
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
