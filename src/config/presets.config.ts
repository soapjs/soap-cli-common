import { basename, join, resolve } from "path";
import { GeneratedPath } from "./config";
import {
  ComponentConfigJson,
  FrameworkDefaults,
  PresetComponentsConfigJson,
} from "./config.types";
import { ComponentsConfigTools } from "./tools/components-config.tools";

export class ComponentPresetConfig {
  public static create(
    root: string,
    type: string,
    data: ComponentConfigJson
  ): ComponentPresetConfig {
    const { name_pattern, element_type, path_pattern, defaults } = data;

    return new ComponentPresetConfig(
      root,
      type,
      name_pattern,
      path_pattern,
      element_type,
      defaults
    );
  }

  constructor(
    public root: string,
    public type: string,
    public namePattern: string,
    public pathPattern: string,
    public elementType: string,
    public defaults: {
      common?: FrameworkDefaults;
      [key: string]: FrameworkDefaults;
    }
  ) {}

  public isEndpointRequired(): boolean {
    return /{{\s*\w*\s*endpoint\s*}}/.test(this.pathPattern);
  }

  public hasDynamicFilename(): boolean {
    return /{{\s*\w*\s*\w+\s*}}/.test(basename(this.pathPattern));
  }

  public generateName(
    name: string,
    rest?: { type?: string; [key: string]: string }
  ): string {
    const { namePattern } = this;
    return ComponentsConfigTools.generateName(namePattern, {
      name,
      ...rest,
    });
  }

  public generatePath(
    replacements: {
      name?: string;
      endpoint?: string;
      type?: string;
      [key: string]: string;
    },
    options?: { useCwd?: boolean }
  ): GeneratedPath {
    const { pathPattern, root } = this;
    return ComponentsConfigTools.generatePath(pathPattern, {
      root: options?.useCwd ? process.cwd() : root,
      ...replacements,
    });
  }
}

export class PresetsConfig {
  public static create(
    dirname: string,
    config: PresetComponentsConfigJson
  ): PresetsConfig {
    const { components } = config;
    let rootPath = resolve(process.cwd());

    if (rootPath.endsWith(dirname) === false) {
      const sourceIndex = rootPath.lastIndexOf(dirname);
      if (sourceIndex !== -1) {
        rootPath = rootPath.substring(0, sourceIndex + dirname.length);
      } else {
        rootPath = join(rootPath, dirname);
      }
    }

    return new PresetsConfig(
      ComponentPresetConfig.create(
        rootPath,
        "controller",
        components.controller
      ),
      ComponentPresetConfig.create(rootPath, "mapper", components.mapper),
      ComponentPresetConfig.create(
        rootPath,
        "collection",
        components.collection
      ),
      ComponentPresetConfig.create(rootPath, "entity", components.entity),
      ComponentPresetConfig.create(rootPath, "model", components.model),
      ComponentPresetConfig.create(
        rootPath,
        "repository",
        components.repository
      ),
      ComponentPresetConfig.create(
        rootPath,
        "repository_impl",
        components.repository_impl
      ),
      ComponentPresetConfig.create(rootPath, "use_case", components.use_case),
      ComponentPresetConfig.create(rootPath, "route", components.route),
      ComponentPresetConfig.create(
        rootPath,
        "route_model",
        components.route_model
      ),
      ComponentPresetConfig.create(rootPath, "route_io", components.route_io),
      ComponentPresetConfig.create(rootPath, "route_schema", components.route_schema),
      ComponentPresetConfig.create(rootPath, "toolset", components.toolset),
      ComponentPresetConfig.create(rootPath, "service", components.service),
      ComponentPresetConfig.create(
        rootPath,
        "service_impl",
        components.service_impl
      ),
      //
      ComponentPresetConfig.create(
        rootPath,
        "controller_unit_tests",
        components.controller_unit_tests
      ),
      ComponentPresetConfig.create(
        rootPath,
        "mapper_unit_tests",
        components.mapper_unit_tests
      ),
      ComponentPresetConfig.create(
        rootPath,
        "collection_unit_tests",
        components.collection_unit_tests
      ),
      ComponentPresetConfig.create(
        rootPath,
        "repository_impl_unit_tests",
        components.repository_impl_unit_tests
      ),
      ComponentPresetConfig.create(
        rootPath,
        "service_impl_unit_tests",
        components.service_impl_unit_tests
      ),
      ComponentPresetConfig.create(
        rootPath,
        "use_case_unit_tests",
        components.use_case_unit_tests
      ),
      ComponentPresetConfig.create(
        rootPath,
        "route_io_unit_tests",
        components.route_io_unit_tests
      ),
      ComponentPresetConfig.create(
        rootPath,
        "toolset_unit_tests",
        components.toolset_unit_tests
      ),
      ComponentPresetConfig.create(
        rootPath,
        "entity_unit_tests",
        components.entity_unit_tests
      ),
      ComponentPresetConfig.create(rootPath, "router", components.router),
      ComponentPresetConfig.create(rootPath, "container", components.container),
      ComponentPresetConfig.create(rootPath, "launcher", components.launcher),
      ComponentPresetConfig.create(rootPath, "config", components.config)
    );
  }

  constructor(
    public readonly controller: ComponentPresetConfig,
    public readonly mapper: ComponentPresetConfig,
    public readonly collection: ComponentPresetConfig,
    public readonly entity: ComponentPresetConfig,
    public readonly model: ComponentPresetConfig,
    public readonly repository: ComponentPresetConfig,
    public readonly repository_impl: ComponentPresetConfig,
    public readonly use_case: ComponentPresetConfig,
    public readonly route: ComponentPresetConfig,
    public readonly route_model: ComponentPresetConfig,
    public readonly route_io: ComponentPresetConfig,
    public readonly route_schema: ComponentPresetConfig,
    public readonly toolset: ComponentPresetConfig,
    public readonly service: ComponentPresetConfig,
    public readonly service_impl: ComponentPresetConfig,
    //
    public readonly controller_unit_tests: ComponentPresetConfig,
    public readonly mapper_unit_tests: ComponentPresetConfig,
    public readonly collection_unit_tests: ComponentPresetConfig,
    public readonly repository_impl_unit_tests: ComponentPresetConfig,
    public readonly service_impl_unit_tests: ComponentPresetConfig,
    public readonly use_case_unit_tests: ComponentPresetConfig,
    public readonly route_io_unit_tests: ComponentPresetConfig,
    public readonly toolset_unit_tests: ComponentPresetConfig,
    public readonly entity_unit_tests: ComponentPresetConfig,
    //
    public readonly router: ComponentPresetConfig,
    public readonly container: ComponentPresetConfig,
    public readonly launcher: ComponentPresetConfig,
    public readonly config: ComponentPresetConfig
  ) {}
}
