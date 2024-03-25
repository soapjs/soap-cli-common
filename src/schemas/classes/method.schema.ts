import { Config, ConfigInstructionParser } from "../../config";
import { AccessType } from "../../enums";
import { TypeInfo, UnknownType } from "../../type.info";
import { GenericDataParser, GenericSchema } from "./generic.schema";
import { ParamDataParser, ParamSchema } from "./param.schema";
import {
  MethodData,
  ParamData,
  GenericData,
  MethodJson,
  MethodSchemaObject,
  GenericJson,
  ParamJson,
} from "../types";
import { SchemaTools } from "../tools/schema.tools";
import { DataProvider } from "../../data-provider";

export const METHOD_REGEX =
  /^(static|async|private|protected|public)?\s*(static|async|private|protected|public)?\s*(async|static|private|protected|public)?\s*([a-zA-Z0-9_]+)(\s*\<(.+)\>\s*)?(\((.*)\))?(\s*:\s*([a-zA-Z0-9\[\]\<\>\{\\}]+))?(\s*=>\s*(.*))?$/;

export class MethodStringParser {
  static parse(method: string): MethodJson {
    let name: string;
    let access: string;
    let params: ParamJson[] = [];
    let return_type: string;
    let is_async: boolean;
    let is_static: boolean;
    let body: string;
    let generics: GenericJson[] = [];
    const match = method.match(METHOD_REGEX);

    if (Array.isArray(match)) {
      access =
        SchemaTools.getAccessType(
          match[1]?.trim(),
          match[2]?.trim(),
          match[3]?.trim()
        ) || AccessType.Public;

      is_static = SchemaTools.isStatic(
        match[1]?.trim(),
        match[2]?.trim(),
        match[3]?.trim()
      );

      is_async = SchemaTools.isAsync(
        match[1]?.trim(),
        match[2]?.trim(),
        match[3]?.trim()
      );

      if (match[4]) {
        name = match[4].trim();
      }

      if (match[10]) {
        return_type = match[10].trim();
      }

      body = match[12]?.trim();

      if (match[6]) {
        SchemaTools.splitIgnoringBrackets(match[6], ",").forEach((str) => {
          generics.push(str);
        });
      }

      if (match[8]) {
        SchemaTools.splitIgnoringBrackets(match[8], ",").forEach((str) => {
          params.push(str);
        });
      }
    } else {
      throw new Error(`Method regex match failure`);
    }

    return {
      name,
      access,
      params,
      return_type,
      is_async,
      is_static,
      body,
      generics,
    };
  }
}

export class MethodDataParser {
  private static parseString(
    method: string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: string
  ) {
    let name: string;
    let access: string;
    let params: ParamData[] = [];
    let returnType: TypeInfo;
    let isAsync: boolean;
    let isStatic: boolean;
    let body: string;
    let supr: MethodData;
    let generics: GenericData[] = [];
    const match = method.match(METHOD_REGEX);

    if (Array.isArray(match)) {
      access =
        SchemaTools.getAccessType(
          match[1]?.trim(),
          match[2]?.trim(),
          match[3]?.trim()
        ) || AccessType.Public;
      isStatic = SchemaTools.isStatic(
        match[1]?.trim(),
        match[2]?.trim(),
        match[3]?.trim()
      );
      isAsync = SchemaTools.isAsync(
        match[1]?.trim(),
        match[2]?.trim(),
        match[3]?.trim()
      );

      if (match[4]) {
        let temp = match[4].trim();
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

      if (match[10]) {
        let temp = match[10].trim();
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

      body = match[12]?.trim();

      SchemaTools.splitIgnoringBrackets(match[6], ",").forEach((str) => {
        generics.push(GenericDataParser.parse(str, config, references).data);
      });
      SchemaTools.splitIgnoringBrackets(match[8], ",").forEach((str) => {
        params.push(ParamDataParser.parse(str, config, references).data);
      });
    } else {
      throw new Error(`Method regex match failure`);
    }

    return {
      name,
      access,
      params,
      return_type: returnType,
      is_async: isAsync,
      is_static: isStatic,
      body,
      supr,
      generics,
      meta,
    };
  }

  private static parseJson(
    method: MethodJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ) {
    let name = method.name;
    let return_type;
    let supr: MethodData;

    if (typeof method.return_type === "string") {
      let temp = method.return_type.trim();
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

    const tempName = method.name.trim();
    if (ConfigInstructionParser.hasInstructions(tempName)) {
      name = ConfigInstructionParser.executeInstructions(
        tempName,
        references,
        config
      );
    } else {
      name = tempName;
    }

    if (method.supr) {
      const meta = SchemaTools.executeMeta(method.supr, references, config);
      if (meta) {
        supr = MethodDataParser.parse(method.supr, config, references).data;
        supr.meta = meta;
      }
    }

    return {
      name,
      params: Array.isArray(method.params)
        ? method.params.reduce((acc, param) => {
            const meta = SchemaTools.executeMeta(param, references, config);
            if (meta) {
              acc.push(
                ParamDataParser.parse(param, config, references, meta).data
              );
            }
            return acc;
          }, [])
        : [],
      generics: Array.isArray(method.generics)
        ? method.generics.reduce((acc, g) => {
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
      access: method.access || AccessType.Public,
      is_async: method.is_async,
      is_static: method.is_static,
      return_type,
      meta,
    };
  }

  static parse(
    method: string | MethodJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): DataProvider<MethodData> {
    if (typeof method === "string") {
      return new DataProvider<MethodData>(
        this.parseString(method, config, references, meta)
      );
    }

    if (method && typeof method === "object") {
      return new DataProvider<MethodData>(
        this.parseJson(method, config, references, meta)
      );
    }
  }
}

export class MethodSchema {
  public static create(
    method: DataProvider<MethodData> | MethodJson | string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] }
  ): MethodSchema {
    if (!method) {
      return null;
    }

    let supr;
    let data: MethodData;

    if (method instanceof DataProvider) {
      data = method.data;
    } else {
      data = MethodDataParser.parse(method, config, references).data;
    }

    if (data.supr) {
      supr = MethodSchema.create(
        new DataProvider(data.supr),
        config,
        references
      );
    }

    const schema = new MethodSchema(
      data.name,
      data.access,
      data.return_type,
      data.is_static,
      data.is_async,
      data.body,
      supr,
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
    public readonly name: string,
    public readonly access: string,
    public readonly returnType: TypeInfo,
    public readonly isStatic: boolean,
    public readonly isAsync: boolean,
    public readonly body: string,
    public readonly supr: MethodSchema,
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

  toObject(): MethodSchemaObject {
    const {
      access,
      __params,
      __generics,
      body,
      supr,
      isAsync,
      isStatic,
      name,
      returnType,
      template,
      meta,
    } = this;

    const mth: MethodSchemaObject = {
      access,
      params: __params.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
      body,
      supr: supr?.toObject(),
      is_async: isAsync,
      is_static: isStatic,
      name,
      return_type: returnType,
      template,
      meta,
    };

    return mth;
  }

  listTypes() {
    const { returnType, __generics, __params, supr } = this;
    const list = [];

    if (returnType) {
      list.push(returnType);
    }

    __generics.forEach((g) => {
      list.push(...g.listTypes());
    });

    __params.forEach((p) => {
      list.push(...p.listTypes());
    });

    if (supr) {
      list.push(...supr.listTypes());
    }

    return list;
  }
}
