import { Config, ConfigInstructionParser } from "../../config";
import { GenericDataParser, GenericSchema } from "./generic.schema";
import {
  InheritanceData,
  InheritanceJson,
  InheritanceSchemaObject,
} from "../types";
import { SchemaTools } from "../tools/schema.tools";
import { DataProvider } from "../../data-provider";

export class InheritanceDataParser {
  private static parseString(
    data: string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): InheritanceData {
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

    return { name, meta, generics: [] };
  }

  private static parseJson(
    data: InheritanceJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): InheritanceData {
    const temp = data.name.trim();
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
      meta,
    };
  }

  static parse(
    generic: string | InheritanceJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): DataProvider<InheritanceData> {
    if (typeof generic === "string") {
      return new DataProvider(
        this.parseString(generic, config, references, meta)
      );
    }

    if (generic && typeof generic === "object") {
      return new DataProvider(
        this.parseJson(generic, config, references, meta)
      );
    }
  }
}

export class InheritanceSchema {
  public static create(
    inht: string | DataProvider<InheritanceData> | InheritanceJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] }
  ) {
    if (!inht) {
      return null;
    }

    let data: InheritanceData;
    if (inht instanceof DataProvider) {
      data = inht.data;
    } else {
      data = InheritanceDataParser.parse(inht, config, references).data;
    }

    const schema = new InheritanceSchema(data.name, data.meta);

    data.generics.forEach((g) => {
      schema.addGeneric(
        GenericSchema.create(new DataProvider(g), config, references)
      );
    });

    return schema;
  }

  private __generics: GenericSchema[] = [];

  private constructor(
    public readonly name: string,
    public readonly meta?: any
  ) {}

  addGeneric(generic: GenericSchema) {
    if (this.hasGeneric(generic) === false) {
      this.__generics.push(generic);
    }
  }

  findGeneric(name: string) {
    return this.__generics.find((p) => p.name === name);
  }

  hasGeneric(generic: GenericSchema) {
    return (
      this.__generics.findIndex(
        (g) =>
          g.name === generic.name &&
          g.dflt === generic.dflt &&
          g.inheritance?.name === generic.inheritance?.name
      ) !== -1
    );
  }

  get generics() {
    return [...this.__generics];
  }

  toObject(): InheritanceSchemaObject {
    const { name, __generics, meta } = this;
    const intf: InheritanceSchemaObject = {
      name,
      generics: __generics.map((g) => g.toObject()),
      meta,
    };

    return intf;
  }

  listTypes() {
    const { __generics } = this;
    const list = [];

    __generics.forEach((g) => {
      list.push(...g.listTypes());
    });

    return list;
  }
}
