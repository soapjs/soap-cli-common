import { Config, ConfigInstructionParser } from "../../config";
import { TypeInfo, ObjectType, UnknownType } from "../../type.info";
import { ExportDataParser, ExportSchema } from "./export.schema";
import { GenericDataParser, GenericSchema } from "./generic.schema";
import { ImportDataParser, ImportSchema } from "./import.schema";
import { PropDataParser, PropSchema } from "./prop.schema";
import {
  TypeData,
  PropData,
  GenericData,
  TypeJson,
  ImportData,
  TypeObject,
} from "../types";
import { SchemaTools } from "../tools/schema.tools";
import { DataProvider } from "../../data-provider";
import { WriteMethod } from "../../enums";

export const TYPE_REGEX =
  /([a-zA-Z0-9_]+)\s*(<([a-zA-Z0-9_, \<\>\[\]\(\)]+)>)?(\s*=\s*(.+))?/;

export class TypeDataParser {
  private static parseJson(
    data: TypeJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): TypeData {
    let type: TypeInfo;
    let alias;
    if (typeof data.type === "string") {
      let temp = data.type.trim();

      if (ConfigInstructionParser.hasInstructions(temp)) {
        temp = ConfigInstructionParser.executeInstructions(
          temp,
          references,
          config
        );
      }
      type = TypeInfo.create(temp, config);
    } else if (TypeInfo.isType(data.type)) {
      type = data.type;
    } else {
      type = UnknownType.create();
    }

    if (typeof data.alias === "string") {
      let temp = data.alias.trim();

      if (ConfigInstructionParser.hasInstructions(temp)) {
        alias = ConfigInstructionParser.executeInstructions(
          temp,
          references,
          config
        );
      } else {
        alias = TypeInfo.create(temp, config);
      }
    } else if (TypeInfo.isType(data.alias)) {
      alias = data.alias;
    }

    return {
      name: data.name,
      alias,
      type,
      write_method: data.write_method || WriteMethod.Write,
      rank: data.rank || 0,
      exp: data.exp ? ExportDataParser.parse(data.exp).data : null,
      props: Array.isArray(data.props)
        ? data.props.reduce((acc, prop) => {
            const meta = SchemaTools.executeMeta(prop, references, config);
            if (meta) {
              acc.push(
                PropDataParser.parse(prop, config, references, meta).data
              );
            }
            return acc;
          }, [])
        : [],
      generics: Array.isArray(data.generics)
        ? data.generics.reduce((acc, g) => {
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
      imports: Array.isArray(data.imports)
        ? data.imports.reduce((acc, i) => {
            const meta = SchemaTools.executeMeta(i, references, config);
            if (meta) {
              const impt = ImportDataParser.parse(
                i,
                config,
                references,
                meta
              ).data;
              acc.push(impt);
            }
            return acc;
          }, [])
        : [],
      meta,
    };
  }

  private static parseString(
    data: string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): TypeData {
    let type: TypeInfo;
    let name: string;
    let props: PropData[] = [];
    let generics: GenericData[] = [];

    const match = data.match(TYPE_REGEX);

    name = match[1].trim();

    SchemaTools.splitIgnoringBrackets(match[3], ",").forEach((str) => {
      generics.push(GenericDataParser.parse(str, config, references).data);
    });

    if (match[5]) {
      try {
        const obj = JSON.parse(match[5]);
        if (obj) {
          Object.keys(obj).forEach((key) => {
            props.push({ name: key, type: obj[key] });
          });
        }
        type = ObjectType.create();
      } catch (e) {
        let temp = match[5].trim();
        if (ConfigInstructionParser.hasInstructions(temp)) {
          temp = ConfigInstructionParser.executeInstructions(
            temp,
            references,
            config
          );
        }
        type = TypeInfo.create(temp, config);
      }
    }

    return {
      type,
      name,
      props,
      generics,
      meta,
      write_method: WriteMethod.Write,
      rank: 0,
    };
  }

  static parse(
    method: string | TypeJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): DataProvider<TypeData> {
    if (typeof method === "string") {
      return new DataProvider<TypeData>(
        this.parseString(method, config, references, meta)
      );
    }

    if (method && typeof method === "object") {
      return new DataProvider<TypeData>(
        this.parseJson(method, config, references, meta)
      );
    }
  }
}

export class TypeSchema {
  public static create<T>(
    type: string | DataProvider<TypeData> | TypeJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] }
  ) {
    if (!type) {
      return null;
    }

    let data: TypeData;

    if (type instanceof DataProvider) {
      data = type.data;
    } else {
      data = TypeDataParser.parse(type, config, references).data;
    }

    let exp;

    if (data.exp) {
      exp = ExportSchema.create(data.exp);
    }

    const schema = new TypeSchema(data.name, data.alias, exp);
    if (Array.isArray(data.generics)) {
      data.generics.forEach((g) => {
        schema.addGeneric(
          GenericSchema.create(new DataProvider(g), config, references)
        );
      });
    }
    if (Array.isArray(data.props)) {
      data.props.forEach((p) => {
        schema.addProp(
          PropSchema.create(new DataProvider(p), config, references)
        );
      });
    }
    if (Array.isArray(data.imports)) {
      data.imports.forEach((i) => {
        schema.addImport(ImportSchema.create(i, config, references));
      });
    }
    return schema as T;
  }

  private __imports: ImportSchema[] = [];
  private __props: PropSchema[] = [];
  private __generics: GenericSchema[] = [];

  private constructor(
    public readonly name: string,
    public readonly alias: TypeInfo,
    public readonly exp: ExportSchema,
    public readonly meta?: any
  ) {}

  addImport(impt: ImportSchema) {
    if (this.hasImport(impt) === false) {
      this.__imports.push(impt);
    }
  }

  findImport(impt: ImportData) {
    const { dflt, path, alias, list } = impt;

    return this.__imports.find(
      (p) =>
        p.path === path &&
        p.alias === alias &&
        p.dflt === dflt &&
        impt.list.every((i) => list.includes(i))
    );
  }

  hasImport(impt: ImportData) {
    const { dflt, path, alias, list } = impt;

    return (
      this.__imports.findIndex(
        (p) =>
          p.path === path &&
          p.alias === alias &&
          p.dflt === dflt &&
          impt.list.every((i) => list.includes(i))
      ) > -1
    );
  }

  get imports() {
    return [...this.__imports];
  }

  addProp(prop: PropSchema) {
    if (this.hasProp(prop.name) === false) {
      this.__props.push(prop);
    }
  }

  findProp(name: string) {
    return this.__props.find((p) => p.name === name);
  }

  hasProp(name: string) {
    return this.__props.findIndex((p) => p.name === name) !== -1;
  }

  get props() {
    return [...this.__props];
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

  toObject(): TypeObject {
    const { __props, __generics, name, exp, alias, __imports, meta } = this;

    return {
      name,
      exp: exp?.toObject(),
      alias,
      props: __props.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
      imports: __imports.map((i) => i.toObject()),
      meta,
    };
  }

  listTypes() {
    const { __props, __generics, alias } = this;
    const types = [];

    if (alias) {
      types.push(alias);
    }

    __props.forEach((prop) => {
      types.push(prop.type);
    });

    __generics.forEach((generic) => {
      if (generic.dflt) {
        types.push(generic.dflt);
      }

      if (generic.inheritance) {
        types.push(generic.inheritance);
      }
    });

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
