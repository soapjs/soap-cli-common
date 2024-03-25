import { ProjectDescription } from "../../types";
import { ConfigJson } from "../config.types";
import { PluginConfig } from "../plugin.config";

export class ConfigJsonParser {
  static parse(
    project: ProjectDescription,
    pluginConfig: PluginConfig
  ): ConfigJson {
    const { databases, code } = pluginConfig;
    const presets = pluginConfig.presets.find((p) => project.preset === p.name);

    return { project, databases, code, presets };
  }
}
