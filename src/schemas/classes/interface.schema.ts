import { nanoid } from "nanoid";
import { Config, ConfigInstructionParser } from "../../config";
import { ExportDataParser, ExportSchema } from "./export.schema";
import { GenericDataParser, GenericSchema } from "./generic.schema";
import { ImportDataParser, ImportSchema } from "./import.schema";
import { InheritanceDataParser, InheritanceSchema } from "./inheritance.schema";
import { MethodDataParser, MethodSchema } from "./method.schema";
import { PropDataParser, PropSchema } from "./prop.schema";
import {
  InterfaceData,
  InterfaceJson,
  ImportData,
  InterfaceSchemaObject,
} from "../types";
import { SchemaTools } from "../tools/schema.tools";
import { DataProvider } from "../../data-provider";
import { WriteMethod } from "../../enums";

export class InterfaceDataParser {
  private static parseJson(
    data: InterfaceJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): InterfaceData {
    let name;
    if (ConfigInstructionParser.hasInstructions(data.name)) {
      name = ConfigInstructionParser.executeInstructions(
        data.name,
        references,
        config
      );
    } else {
      name = data.name;
    }

    return {
      name,
      rank: data.rank || 0,
      write_method: data.write_method || WriteMethod.Write,
      exp: data.exp ? ExportDataParser.parse(data.exp).data : null,
      methods: Array.isArray(data.methods)
        ? data.methods.reduce((acc, method) => {
            const meta = SchemaTools.executeMeta(method, references, config);
            if (meta) {
              acc.push(
                MethodDataParser.parse(method, config, references, meta).data
              );
            }
            return acc;
          }, [])
        : [],
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
      inheritance: Array.isArray(data.inheritance)
        ? data.inheritance.reduce((acc, i) => {
            const meta = SchemaTools.executeMeta(i, references, config);
            if (meta) {
              const inht = InheritanceDataParser.parse(
                i,
                config,
                references,
                meta
              ).data;
              acc.push(inht);
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
  ): InterfaceData {
    const temp = data.trim();
    let name;
    if (ConfigInstructionParser.hasInstructions(temp)) {
      name = ConfigInstructionParser.executeInstructions(
        temp,
        references,
        config
      );
    } else {
      name = temp;
    }

    return {
      name,
      meta,
      generics: [],
      inheritance: [],
      imports: [],
      methods: [],
      props: [],
      write_method: WriteMethod.Write,
      rank: 0,
    };
  }

  static parse(
    data: InterfaceJson | string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): DataProvider<InterfaceData> {
    if (typeof data === "string") {
      return new DataProvider<InterfaceData>(
        this.parseString(data, config, references, meta)
      );
    }

    if (data && typeof data === "object") {
      return new DataProvider<InterfaceData>(
        this.parseJson(data, config, references, meta)
      );
    }
  }
}

export class InterfaceSchema {
  public static create(
    intf: DataProvider<InterfaceData> | InterfaceJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] }
  ) {
    if (!intf) {
      return null;
    }

    let data: InterfaceData;

    if (intf instanceof DataProvider) {
      data = intf.data;
    } else {
      data = InterfaceDataParser.parse(intf, config, references).data;
    }

    let exp;

    if (data.exp) {
      exp = ExportSchema.create(data.exp);
    }

    const schema = new InterfaceSchema(
      data.id || nanoid(),
      data.name,
      exp,
      data.inheritance.map((i) =>
        InheritanceSchema.create(new DataProvider(i), config, references)
      ),
      data.meta
    );

    if (Array.isArray(data.props)) {
      data.props.forEach((p) => {
        schema.addProp(
          PropSchema.create(new DataProvider(p), config, references)
        );
      });
    }

    if (Array.isArray(data.methods)) {
      data.methods.forEach((m) => {
        schema.addMethod(
          MethodSchema.create(new DataProvider(m), config, references)
        );
      });
    }

    if (Array.isArray(data.generics)) {
      data.generics.forEach((g) => {
        schema.addGeneric(
          GenericSchema.create(new DataProvider(g), config, references)
        );
      });
    }

    if (Array.isArray(data.imports)) {
      data.imports.forEach((i) => {
        schema.addImport(
          ImportSchema.create(new DataProvider(i), config, references)
        );
      });
    }

    return schema;
  }

  private __imports: ImportSchema[] = [];
  private __props: PropSchema[] = [];
  private __methods: MethodSchema[] = [];
  private __generics: GenericSchema[] = [];
  private __inheritance: InheritanceSchema[] = [];

  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly exp: ExportSchema,
    inheritance: InheritanceSchema[] = [],
    public readonly meta?: any
  ) {
    if (Array.isArray(inheritance)) {
      inheritance.forEach((i) => {
        this.__inheritance.push(i);
      });
    }
  }

  get inheritance() {
    return [...this.__inheritance];
  }

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

  addMethod(method: MethodSchema) {
    if (this.hasMethod(method.name) === false) {
      this.__methods.push(method);
    }
  }

  findMethod(name: string) {
    return this.__methods.find((p) => p.name === name);
  }

  hasMethod(name: string) {
    return this.__methods.findIndex((p) => p.name === name) !== -1;
  }

  get methods() {
    return [...this.__methods];
  }

  toObject(): InterfaceSchemaObject {
    const {
      id,
      name,
      __methods,
      __props,
      __generics,
      __imports,
      __inheritance,
      exp,
      meta,
    } = this;
    const intf: InterfaceSchemaObject = {
      name,
      inheritance: __inheritance?.map((i) => i.toObject()),
      exp: exp?.toObject(),
      methods: __methods.map((i) => i.toObject()),
      props: __props.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
      imports: __imports.map((i) => i.toObject()),
      meta,
    };

    return intf;
  }

  listTypes() {
    const { inheritance, __methods, __generics, __props } = this;
    const list = [];

    __generics.forEach((g) => {
      list.push(...g.listTypes());
    });

    __props.forEach((p) => {
      list.push(...p.listTypes());
    });

    __methods.forEach((m) => {
      list.push(...m.listTypes());
    });

    if (inheritance) {
      list.push(inheritance);
    }

    return list;
  }
}
