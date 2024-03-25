import { Config } from "../../config";
import { TypeInfo } from "../../type.info";
import { ExportSchema } from "./export.schema";
import { FunctionSchema } from "./function.schema";
import { ImportSchema } from "./import.schema";
import { PropDataParser, PropSchema } from "./prop.schema";
import { SourceFileData, ImportData } from "../types";
import { SchemaTools } from "../tools/schema.tools";
import { DataProvider } from "../../data-provider";

export class SourceFileSchema {
  public static create<T>(
    data: SourceFileData,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): T {
    if (!data) {
      return null;
    }

    let exp: ExportSchema;

    if (data.exp) {
      exp = ExportSchema.create(data.exp);
    }

    const cls = new SourceFileSchema(
      data.name,
      exp,
      (<SourceFileData>data).template,
      meta
    );

    if (Array.isArray(data.props)) {
      data.props.forEach((p) => {
        cls.addProp(PropSchema.create(new DataProvider(p), config, references));
      });
    }

    if (Array.isArray(data.functions)) {
      data.functions.forEach((m) => {
        cls.addFunction(
          FunctionSchema.create(new DataProvider(m), config, references)
        );
      });
    }

    if (Array.isArray(data.imports)) {
      data.imports.forEach((i) => {
        cls.addImport(
          ImportSchema.create(new DataProvider(i), config, references)
        );
      });
    }

    return cls as T;
  }

  private __imports: ImportSchema[] = [];
  private __props: PropSchema[] = [];
  private __functions: FunctionSchema[] = [];

  private constructor(
    public readonly name: string,
    public readonly exp: ExportSchema,
    private template: string,
    public readonly meta?: any
  ) {}

  addImport(impt: ImportSchema) {
    if (this.hasImport(impt) === false) {
      this.__imports.push(impt);
    }
  }

  findImport(data: ImportData) {
    const { list, ...rest } = data;
    const restKeys = Object.keys(rest);

    return this.__imports.find((impt) => {
      const found =
        Array.isArray(list) && list.length > 0
          ? impt.list.some((i) => list.includes(i))
          : true;

      for (const key of restKeys) {
        const k = impt[key];
        if (k && k !== rest[key]) {
          return false;
        }
      }
      return found;
    });
  }

  hasImport(impt: ImportData) {
    const { dflt, path, alias, list } = impt;

    return (
      this.__imports.findIndex(
        (p) =>
          p.path === path &&
          p.alias === alias &&
          p.dflt === dflt &&
          list.every((i) => p.list.includes(i))
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

  addFunction(fn: FunctionSchema) {
    if (this.hasFunction(fn.name) === false) {
      this.__functions.push(fn);
    }
  }

  findFunction(name: string) {
    return this.__functions.find((p) => p.name === name);
  }

  hasFunction(name: string) {
    return this.__functions.findIndex((p) => p.name === name) !== -1;
  }

  get functions() {
    return [...this.__functions];
  }

  toObject() {
    const { name, exp, __functions, __props, __imports, template, meta } = this;

    const fl = {
      name,
      exp: exp?.toObject(),
      functions: __functions.map((i) => i.toObject()),
      props: __props.map((p) => p.toObject()),
      imports: __imports.map((i) => i.toObject()),
      template,
      meta,
    };

    return fl;
  }

  listTypes() {
    const { __functions, __props } = this;
    const types: TypeInfo[] = [];

    __props.forEach((p) => {
      types.push(...p.listTypes());
    });

    __functions.forEach((m) => {
      types.push(...m.listTypes());
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
