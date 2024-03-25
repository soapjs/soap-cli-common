import { camelCase } from "change-case";
import { Config, ConfigInstructionParser } from "../../config";
import { TypeInfo, UnknownType } from "../../type.info";
import { PropData, PropJson, PropSchemaObject } from "../types";
import { SchemaTools } from "../tools/schema.tools";
import { DataProvider } from "../../data-provider";

export const PROP_REGEX =
  /^(inject)?\s*(private|protected|public)?\s*(static|readonly)?\s*([a-zA-Z0-9_]+)(\?)?(\s*:\s*([a-zA-Z0-9\[\]\<\>\{\}\|\& ]+))?(\s*=\s*(.+))?$/;

export class PropDataParser {
  private static parseString(
    prop: string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ) {
    let name: string;
    let type: TypeInfo;
    let value: unknown;
    let isReadonly: boolean;
    let isStatic: boolean;
    let isOptional: boolean;
    let access: string;

    const match = prop.match(PROP_REGEX);

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

      isReadonly = match[3] === "readonly";
      isStatic = match[3] === "static";
      isOptional = !!match[5];
      access = match[2]?.trim();
    } else {
      throw new Error(`Prop regex match failure`);
    }

    return {
      name,
      type,
      value,
      is_readonly: isReadonly,
      is_static: isStatic,
      is_optional: isOptional,
      access,
      meta,
    };
  }

  private static parseJson(
    prop: PropJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ) {
    let name: string;
    let type: TypeInfo;
    let value: unknown;

    if (typeof prop.value === "string") {
      const temp = prop.value.trim();
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
      value = SchemaTools.parseValue(prop.value, (value) => {
        return ConfigInstructionParser.hasInstructions(value)
          ? ConfigInstructionParser.executeInstructions(
              value,
              references,
              config
            )
          : value;
      });
    }

    if (typeof prop.type === "string") {
      let temp = prop.type.trim();
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

    if (typeof prop.name === "string") {
      const temp = prop.name.trim();
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
      name = prop.name;
    }

    return {
      name,
      type,
      access: prop.access,
      is_optional: prop.is_optional,
      is_readonly: prop.is_readonly,
      is_static: prop.is_static,
      value,
      meta,
    };
  }

  static parse(
    prop: string | PropJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): DataProvider<PropData> {
    if (typeof prop === "string") {
      return new DataProvider(this.parseString(prop, config, references, meta));
    }

    if (prop && typeof prop === "object") {
      return new DataProvider(this.parseJson(prop, config, references, meta));
    }
  }
}

export class PropSchema {
  public static create(
    prop: DataProvider<PropData> | PropJson | string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
  ): PropSchema {
    if (!prop) {
      return null;
    }

    let data: PropData;

    if (prop instanceof DataProvider) {
      data = prop.data;
    } else {
      data = PropDataParser.parse(prop, config, references).data;
    }

    return new PropSchema(
      camelCase(data.name),
      data.type,
      data.access,
      data.is_optional,
      data.is_readonly,
      data.is_static,
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
    public readonly isStatic: boolean,
    public readonly value: any,
    public readonly template: string,
    public readonly meta?: any
  ) {}

  toObject(): PropSchemaObject {
    const {
      name,
      type,
      access,
      isOptional: is_optional,
      isReadonly: is_readonly,
      isStatic: is_static,
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
      is_static,
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
