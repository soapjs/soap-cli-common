import { ParamSchema, ParamDataParser } from "./param.schema";
import { Config, ConfigInstructionParser } from "../../config";
import { SchemaTools } from "../tools/schema.tools";
import { AccessType } from "../../enums";
import {
  ConstructorData,
  ConstructorJson,
  ConstructorSchemaObject,
  ParamData,
} from "../types";
import { DataProvider } from "../../data-provider";

export const CTOR_REGEX = /^(private|protected|public)?\s*(\((.*)\))$/;

export class ConstructorDataParser {
  private static parseString(
    ctor: string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: string
  ) {
    const match = ctor.match(CTOR_REGEX);
    let access: string = AccessType.Public;
    const params: ParamData[] = [];

    if (Array.isArray(match)) {
      if (match[1]) {
        access = match[1].trim();
      }
      SchemaTools.splitIgnoringBrackets(match[3], ",").forEach((str) => {
        params.push(ParamDataParser.parse(str, config, references).data);
      });
    } else {
      throw new Error(`Constructor regex match failure`);
    }

    return {
      access,
      params,
      meta,
    };
  }

  private static parseJson(
    data: ConstructorJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ) {
    let supr;

    if (data.supr) {
      supr = this.parse(data.supr, config, references).data;
    }

    return {
      supr,
      params: Array.isArray(data.params)
        ? data.params.reduce((acc, param) => {
            const meta = SchemaTools.executeMeta(param, references, config);
            if (meta) {
              acc.push(
                ParamDataParser.parse(param, config, references, meta).data
              );
            }
            return acc;
          }, [])
        : [],
      access: data.access || AccessType.Public,
      body: data.body,
      meta,
    };
  }

  static parse(
    ctor: string | ConstructorJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): DataProvider<ConstructorData> {
    if (typeof ctor === "string") {
      return new DataProvider<ConstructorData>(
        this.parseString(ctor, config, references, meta)
      );
    }

    if (ctor && typeof ctor === "object") {
      return new DataProvider<ConstructorData>(
        this.parseJson(ctor, config, references, meta)
      );
    }
  }
}

export class ConstructorSchema {
  public static create(
    ctor: DataProvider<ConstructorData> | ConstructorJson | string,
    config?: Config,
    references?: { [key: string]: unknown; dependencies: any[] }
  ) {
    let supr;
    let data: ConstructorData;

    if (ctor instanceof DataProvider) {
      data = ctor.data;
    } else {
      data = ConstructorDataParser.parse(ctor, config, references).data;
    }

    if (data.supr) {
      supr = ConstructorSchema.create(
        new DataProvider(data.supr),
        config,
        references
      );
    }

    const schema = new ConstructorSchema(
      data.access,
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

    return schema;
  }

  private readonly __params: ParamSchema[] = [];

  private constructor(
    public readonly access: string,
    public readonly body: string,
    public readonly supr: ConstructorSchema,
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

  toObject(): ConstructorSchemaObject {
    const { access, __params, body, supr, template, meta } = this;
    const ctr: ConstructorSchemaObject = {
      access,
      params: __params.map((p) => p.toObject()),
      body,
      supr: supr?.toObject(),
      template,
      meta,
    };

    if (supr) {
      ctr.supr = supr.toObject();
    }

    return ctr;
  }

  listTypes() {
    const { __params, supr } = this;
    const list = [];

    __params.forEach((p) => {
      list.push(...p.listTypes());
    });

    if (supr) {
      list.push(supr);
    }

    return list;
  }
}
