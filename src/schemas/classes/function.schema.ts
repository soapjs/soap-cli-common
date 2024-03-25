import { Config, ConfigInstructionParser } from "../../config";
import { TypeInfo, UnknownType } from "../../type.info";
import { ExportSchema } from "./export.schema";
import { GenericDataParser, GenericSchema } from "./generic.schema";
import { ParamDataParser, ParamSchema } from "./param.schema";
import {
  FunctionData,
  ParamData,
  GenericData,
  FunctionJson,
  FunctionSchemaObject,
} from "../types";
import { SchemaTools } from "../tools/schema.tools";
import { DataProvider } from "../../data-provider";

export const FUNCTION_REGEX =
  /^(async)?\s*([a-zA-Z0-9_]+)(\s*\<(.+)\>\s*)?(\((.*)\))?(\s*:\s*([a-zA-Z0-9\[\]\<\>\{\\}]+))?(\s*=>\s*(.*))?$/;

export class FunctionDataParser {
  private static parseString(
    fn: string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: string
  ) {
    let name: string;
    let params: ParamData[] = [];
    let returnType: TypeInfo;
    let isAsync: boolean;
    let body: string;
    let generics: GenericData[] = [];
    const match = fn.match(FUNCTION_REGEX);

    if (Array.isArray(match)) {
      isAsync = !!match[1];
      if (match[2]) {
        let temp = match[2].trim();
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
      body = match[10]?.trim();
      if (match[8]) {
        let temp = match[8].trim();
        if (ConfigInstructionParser.hasInstructions(temp)) {
          temp = ConfigInstructionParser.executeInstructions(
            temp,
            references,
            config
          );
        }
        returnType = TypeInfo.isType(temp)
          ? temp
          : TypeInfo.create(temp, config);
      } else {
        returnType = UnknownType.create();
      }
      SchemaTools.splitIgnoringBrackets(match[4], ",").forEach((str) => {
        generics.push(GenericDataParser.parse(str, config, references).data);
      });
      SchemaTools.splitIgnoringBrackets(match[6], ",").forEach((str) => {
        params.push(ParamDataParser.parse(str, config, references).data);
      });
    } else {
      throw new Error(`Function regex match failure`);
    }

    return {
      name,
      params,
      return_type: returnType,
      is_async: isAsync,
      body,
      generics,
    };
  }

  private static parseJson(
    fn: FunctionJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ) {
    let name = fn.name;
    let return_type;

    if (typeof fn.return_type === "string") {
      let temp = fn.return_type.trim();
      if (ConfigInstructionParser.hasInstructions(temp)) {
        temp = ConfigInstructionParser.executeInstructions(
          temp,
          references,
          config
        );
      }
      return_type = TypeInfo.isType(temp)
        ? temp
        : TypeInfo.create(temp, config);
    }

    const tempName = fn.name.trim();
    if (ConfigInstructionParser.hasInstructions(tempName)) {
      name = ConfigInstructionParser.executeInstructions(
        tempName,
        references,
        config
      );
    } else {
      name = tempName;
    }

    return {
      name,
      params: Array.isArray(fn.params)
        ? fn.params.reduce((acc, param) => {
            const meta = SchemaTools.executeMeta(param, references, config);
            if (meta) {
              acc.push(
                ParamDataParser.parse(param, config, references, meta).data
              );
            }
            return acc;
          }, [])
        : [],
      generics: Array.isArray(fn.generics)
        ? fn.generics.reduce((acc, g) => {
            const meta = SchemaTools.executeMeta(g, references, config);
            if (meta) {
              const generic = GenericDataParser.parse(
                g,
                config,
                references,
                meta
              ).data;
              acc.push(generic);
            }
            return acc;
          }, [])
        : [],
      is_async: fn.is_async,
      return_type,
      meta,
    };
  }

  static parse(
    ctor: string | FunctionJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): DataProvider<FunctionData> {
    if (typeof ctor === "string") {
      return new DataProvider<FunctionData>(
        this.parseString(ctor, config, references, meta)
      );
    }

    if (ctor && typeof ctor === "object") {
      return new DataProvider<FunctionData>(
        this.parseJson(ctor, config, references, meta)
      );
    }
  }
}

export class FunctionSchema {
  public static create(
    fn: DataProvider<FunctionData> | FunctionJson | string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] }
  ): FunctionSchema {
    if (!fn) {
      return null;
    }

    let data: FunctionData;

    if (fn instanceof DataProvider) {
      data = fn.data;
    } else {
      data = FunctionDataParser.parse(fn, config, references).data;
    }

    let exp;

    if (data.exp) {
      exp = ExportSchema.create(data.exp);
    }

    const schema = new FunctionSchema(
      exp,
      data.name,
      data.return_type,
      data.is_async,
      data.body,
      data.template,
      data.meta
    );

    if (Array.isArray(data.params)) {
      data.params.forEach((param) => {
        schema.addParam(ParamSchema.create(new DataProvider(param)));
      });
    }
    if (Array.isArray(data.generics)) {
      data.generics.forEach((generic) => {
        schema.addGeneric(
          GenericSchema.create(new DataProvider(generic), config, references)
        );
      });
    }
    return schema;
  }

  private __params: ParamSchema[] = [];
  private __generics: GenericSchema[] = [];

  private constructor(
    public readonly exp: ExportSchema,
    public readonly name: string,
    public readonly returnType: TypeInfo,
    public readonly isAsync: boolean,
    public readonly body: string,
    public readonly template: string,
    public readonly meta?: any
  ) {}

  addParam(param: ParamSchema) {
    if (this.hasParam(param.name) === false) {
      this.__params.push(param);
    }
  }

  findParam(name: string) {
    return this.__params.find((p) => p.name === name);
  }

  hasParam(name: string) {
    return this.__params.findIndex((p) => p.name === name) !== -1;
  }

  get params() {
    return [...this.__params];
  }

  addGeneric(generic: GenericSchema) {
    if (this.hasGeneric(generic.name) === false) {
      this.__generics.push(generic);
    }
  }

  findGeneric(name: string) {
    return this.__generics.find((p) => p.name === name);
  }

  hasGeneric(name: string) {
    return this.__generics.findIndex((p) => p.name === name) !== -1;
  }

  get generics() {
    return [...this.__generics];
  }

  toObject(): FunctionSchemaObject {
    const {
      __params,
      __generics,
      body,
      name,
      isAsync,
      returnType,
      exp,
      template,
      meta,
    } = this;
    const fn: FunctionSchemaObject = {
      exp: exp?.toObject(),
      params: __params.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
      body,
      name,
      is_async: isAsync,
      return_type: returnType,
      template,
      meta,
    };

    return fn;
  }

  listTypes() {
    const { returnType, __params, __generics } = this;
    const types = [];

    __generics.forEach((g) => {
      types.push(...g.listTypes());
    });

    __params.forEach((p) => {
      types.push(...p.listTypes());
    });

    if (returnType) {
      types.push(returnType);
    }

    return types.reduce((list: TypeInfo[], current: TypeInfo) => {
      const keys = Object.keys(current);
      if (
        list.findIndex((i) => {
          for (const key of keys) {
            if (i[key] !== current[key]) {
              return false;
            }
          }
          return true;
        }) === -1
      ) {
        list.push(current);
      }
      return list;
    }, []);
  }
}
