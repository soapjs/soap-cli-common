import { camelCase } from "change-case";
import { Config, ConfigInstructionParser } from "../../config";
import { TypeInfo, UnknownType } from "../../type.info";
import { ParamData, ParamJson, ParamSchemaObject } from "../types";
import { SchemaTools } from "../tools/schema.tools";
import { DataProvider } from "../../data-provider";

export const PARAM_REGEX =
  /^(inject)?\s*(private|protected|public)?\s*(readonly)?\s*([a-zA-Z0-9_]+)(\?)?(\s*:\s*([a-zA-Z0-9\[\]\<\>\{\}\|\& ]+))?(\s*=\s*(.+))?$/;

export class ParamStringParser {
  static parse(param: string): ParamJson {
    let name: string;
    let type: string;
    let value: unknown;
    const match = param.match(PARAM_REGEX);

    if (Array.isArray(match)) {
      if (match[4]) {
        name = match[4].trim();
      }

      if (match[7]) {
        type = match[7].trim();
      } else {
        type = "unknown";
      }

      if (match[9]) {
        value = match[9].trim();
      }
    } else {
      throw new Error(`Param regex match failure`);
    }

    return {
      name,
      type,
      value,
      is_readonly: !!match[3],
      is_optional: !!match[5],
      access: match[2]?.trim(),
    };
  }
}

export class ParamDataParser {
  private static parseString(
    param: string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ) {
    let name: string;
    let type: TypeInfo;
    let value: unknown;
    let isReadonly: boolean;
    let isOptional: boolean;
    let access: string;
    const match = param.match(PARAM_REGEX);

    if (Array.isArray(match)) {
      if (match[4]) {
        const temp = match[4].trim();
        if (ConfigInstructionParser.hasInstructions(temp)) {
          name = ConfigInstructionParser.executeInstructions(
            temp,
            references,
            config
          );
        } else {
          name = temp;
        }
      }

      if (match[7]) {
        let temp = match[7].trim();
        if (ConfigInstructionParser.hasInstructions(temp)) {
          temp = ConfigInstructionParser.executeInstructions(
            temp,
            references,
            config
          );
        }
        if (TypeInfo.isType(temp)) {
          type = temp;
        } else {
          type = TypeInfo.create(temp, config);
        }
      } else {
        type = UnknownType.create();
      }

      if (match[9]) {
        const temp = match[9].trim();
        if (ConfigInstructionParser.hasInstructions(temp)) {
          value = ConfigInstructionParser.executeInstructions(
            temp,
            references,
            config
          );
        } else {
          value = temp;
        }
      }

      isReadonly = !!match[3];
      isOptional = !!match[5];
      access = match[2]?.trim();
    } else {
      throw new Error(`Param regex match failure`);
    }

    return {
      name,
      type,
      value,
      is_readonly: isReadonly,
      is_optional: isOptional,
      access,
      meta,
    };
  }

  private static parseJson(
    param: ParamJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ) {
    let name: string;
    let type: TypeInfo;
    let value: unknown;
    let isReadonly: boolean;
    let isOptional: boolean;
    let access: string;

    if (typeof param.value === "string") {
      const temp = param.value.trim();
      if (ConfigInstructionParser.hasInstructions(temp)) {
        value = ConfigInstructionParser.executeInstructions(
          temp,
          references,
          config
        );
      } else {
        value = temp;
      }
    } else {
      value = SchemaTools.parseValue(param.value, (value) => {
        return ConfigInstructionParser.hasInstructions(value)
          ? ConfigInstructionParser.executeInstructions(
              value,
              references,
              config
            )
          : value;
      });
    }

    if (typeof param.type === "string") {
      let temp = param.type.trim();
      if (ConfigInstructionParser.hasInstructions(temp)) {
        temp = ConfigInstructionParser.executeInstructions(
          temp,
          references,
          config
        );
      }
      if (TypeInfo.isType(temp)) {
        type = temp;
      } else {
        type = TypeInfo.create(temp, config);
      }
    }

    if (typeof param.name === "string") {
      const temp = param.name.trim();
      if (ConfigInstructionParser.hasInstructions(temp)) {
        name = ConfigInstructionParser.executeInstructions(
          temp,
          references,
          config
        );
      } else {
        name = temp;
      }
    } else {
      name = param.name;
    }

    return {
      name,
      type,
      value,
      is_readonly: isReadonly,
      is_optional: isOptional,
      access,
      meta,
    };
  }

  static parse(
    param: string | ParamJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): DataProvider<ParamData> {
    if (typeof param === "string") {
      return new DataProvider(
        this.parseString(param, config, references, meta)
      );
    } else if (typeof param === "object") {
      return new DataProvider(this.parseJson(param, config, references, meta));
    }
  }
}

export class ParamSchema {
  public static create(
    param: DataProvider<ParamData> | ParamJson | string,
    config?: Config,
    references?: { [key: string]: unknown; dependencies: any[] }
  ): ParamSchema {
    if (!param) {
      return null;
    }

    let data: ParamData;

    if (param instanceof DataProvider) {
      data = param.data;
    } else {
      data = ParamDataParser.parse(param, config, references).data;
    }

    return new ParamSchema(
      camelCase(data.name),
      data.type,
      data.access,
      data.is_optional,
      data.is_readonly,
      data.value,
      data.template,
      data.meta
    );
  }

  private constructor(
    public readonly name: string,
    public readonly type: TypeInfo,
    public readonly access: string,
    public readonly isOptional: boolean,
    public readonly isReadonly: boolean,
    public readonly value: any,
    public readonly template: string,
    public readonly meta?: any
  ) {}

  toObject(): ParamSchemaObject {
    const {
      name,
      type,
      access,
      isOptional: is_optional,
      isReadonly: is_readonly,
      value,
      template,
      meta,
    } = this;

    return {
      name,
      type,
      access,
      is_optional,
      is_readonly,
      value,
      template,
      meta,
    };
  }

  listTypes() {
    const { type } = this;
    return [type];
  }
}
