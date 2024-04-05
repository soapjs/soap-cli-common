import { Config } from "../../config";
import { SchemaTools } from "../tools/schema.tools";
import { TypeInfo } from "../../type.info";
import { ConstructorDataParser, ConstructorSchema } from "./constructor.schema";
import { ExportSchema, ExportDataParser } from "./export.schema";
import { GenericDataParser, GenericSchema } from "./generic.schema";
import { ImportDataParser, ImportSchema } from "./import.schema";
import { InheritanceDataParser, InheritanceSchema } from "./inheritance.schema";
import { InterfaceDataParser, InterfaceSchema } from "./interface.schema";
import { MethodDataParser, MethodSchema } from "./method.schema";
import { PropDataParser, PropSchema } from "./prop.schema";
import { ClassData, ClassJson, ClassSchemaObject, ImportData } from "../types";
import { WriteMethod } from "../../enums";
import { DataProvider } from "../../data-provider";

export class ClassDataParser {
  static parse(
    data: ClassJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): DataProvider<ClassData> {
    const { id, name, is_abstract } = data;
    let ctor;

    if (data.ctor) {
      const meta = SchemaTools.executeMeta(data.ctor, references, config);
      if (meta) {
        ctor = ConstructorDataParser.parse(
          data.ctor,
          config,
          references,
          meta
        ).data;
      }
    }

    return new DataProvider({
      id,
      name,
      is_abstract,
      ctor,
      write_method: data.write_method || WriteMethod.Write,
      rank: data.rank || 0,
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
      interfaces: Array.isArray(data.interfaces)
        ? data.interfaces.reduce((acc, i) => {
            const meta = SchemaTools.executeMeta(i, references, config);
            if (meta) {
              const impt = InterfaceDataParser.parse(
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
    });
  }
}

export class ClassSchema {
  public static create<T>(
    cls: DataProvider<ClassData> | ClassJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] }
  ): T {
    if (!cls) {
      return null;
    }

    let data: ClassData;

    if (cls instanceof DataProvider) {
      data = cls.data;
    } else {
      data = ClassDataParser.parse(cls, config, references).data;
    }

    let exp: ExportSchema;
    let ctor: ConstructorSchema;
    let inheritance: InheritanceSchema[] = [];

    if (data.exp) {
      exp = ExportSchema.create(data.exp);
    }

    if (data.ctor) {
      ctor = ConstructorSchema.create(
        new DataProvider(data.ctor),
        config,
        references
      );
    }

    if (Array.isArray(data.inheritance)) {
      data.inheritance.forEach((i) => {
        if (typeof i === "string") {
          inheritance.push(
            InheritanceSchema.create({ name: i }, config, references)
          );
        } else {
          inheritance.push(
            InheritanceSchema.create(new DataProvider(i), config, references)
          );
        }
      });
    }

    const schema = new ClassSchema(
      data.is_abstract || false,
      data.name,
      exp,
      ctor,
      inheritance,
      (<ClassData>data).template
    );

    if (Array.isArray(data.interfaces)) {
      data.interfaces.forEach((i) => {
        schema.addInterface(
          InterfaceSchema.create(new DataProvider(i), config, references)
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

    return schema as T;
  }

  private __imports: ImportSchema[] = [];
  private __props: PropSchema[] = [];
  private __methods: MethodSchema[] = [];
  private __generics: GenericSchema[] = [];
  private __interfaces: InterfaceSchema[] = [];
  private __inheritance: InheritanceSchema[] = [];

  private constructor(
    public readonly isAbstract: boolean,
    public readonly name: string,
    public readonly exp: ExportSchema,
    public readonly ctor: ConstructorSchema,
    inheritance: InheritanceSchema[] = [],
    private template: string
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

  addInterface(intf: InterfaceSchema) {
    if (this.hasInterface(intf.name) === false) {
      this.__interfaces.push(intf);
    }
  }

  findInterface(name: string) {
    return this.__interfaces.find((p) => p.name === name);
  }

  hasInterface(name: string) {
    return this.__interfaces.findIndex((p) => p.name === name) !== -1;
  }

  get interfaces() {
    return [...this.__interfaces];
  }

  toObject(): ClassSchemaObject {
    const {
      name,
      ctor,
      exp,
      isAbstract,
      __inheritance,
      __methods,
      __props,
      __generics,
      __interfaces,
      __imports,
      template,
    } = this;

    const cls: ClassSchemaObject = {
      is_abstract: isAbstract,
      name,
      inheritance: __inheritance?.map((i) => i.toObject()),
      ctor: ctor?.toObject(),
      exp: exp?.toObject(),
      methods: __methods.map((i) => i.toObject()),
      props: __props.map((p) => p.toObject()),
      generics: __generics.map((g) => g.toObject()),
      interfaces: __interfaces.map((i) => i.toObject()),
      imports: __imports.map((i) => i.toObject()),
      template,
    };

    return cls;
  }

  listTypes() {
    const { inheritance, __methods, __generics, __props, __interfaces } = this;
    const types: TypeInfo[] = [];

    __generics.forEach((g) => {
      types.push(...g.listTypes());
    });

    __props.forEach((p) => {
      types.push(...p.listTypes());
    });

    __methods.forEach((m) => {
      types.push(...m.listTypes());
    });

    __interfaces.forEach((i) => {
      types.push(...i.listTypes());
    });

    inheritance.forEach((i) => {
      types.push(...i.listTypes());
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
