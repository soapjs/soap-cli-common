import { Config, ConfigInstructionParser } from "../../config";
import { TypeInfo } from "../../type.info";
import { InheritanceSchema } from "./inheritance.schema";
import { GenericData, GenericJson, GenericSchemaObject } from "../types";
import { DataProvider } from "../../data-provider";

export class GenericStringParser {
  static parse(str: string): GenericJson {
    let inheritance;
    let name;
    let dflt;

    const match = str.match(
      /([a-zA-Z0-9_\<\>\[\]]+)\s*(extends\s+([a-zA-Z0-9_\<\>\[\] \|\&,]+))?(\s*=\s*([a-zA-Z0-9_\<\>\[\] \|\&,]+))?/
    );
    if (match[1]) {
      name = match[1].trim();
    }

    if (match[3]) {
      inheritance = match[3].trim();
    }

    if (match[5]) {
      dflt = match[5].trim();
    }

    return {
      inheritance,
      name,
      dflt,
    };
  }
}

export class GenericDataParser {
  private static parseString(
    str: string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): GenericData {
    let inheritance;
    let name;
    let dflt;

    const match = str.match(
      /([a-zA-Z0-9_\<\>\[\]]+)\s*(extends\s+([a-zA-Z0-9_\<\>\[\] \|\&,]+))?(\s*=\s*([a-zA-Z0-9_\<\>\[\] \|\&,]+))?/
    );
    if (match[1]) {
      let temp = match[1].trim();
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

    if (match[3]) {
      let temp = match[3].trim();

      if (ConfigInstructionParser.hasInstructions(temp)) {
        inheritance = ConfigInstructionParser.executeInstructions(
          temp,
          references,
          config
        );
      } else {
        inheritance = TypeInfo.create(temp, config);
      }
    }

    if (match[5]) {
      let temp = match[5].trim();

      if (ConfigInstructionParser.hasInstructions(temp)) {
        dflt = ConfigInstructionParser.executeInstructions(
          temp,
          references,
          config
        );
      } else {
        dflt = TypeInfo.create(temp, config);
      }
    }

    return {
      inheritance,
      name,
      dflt,
      meta,
    };
  }

  private static parseJson(
    data: GenericJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): GenericData {
    let name = data.name;
    let dflt;
    let inheritance;

    if (typeof data.name === "string") {
      let temp = data.name.trim();
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

    if (typeof data.dflt === "string") {
      let temp = data.dflt.trim();

      if (ConfigInstructionParser.hasInstructions(temp)) {
        dflt = ConfigInstructionParser.executeInstructions(
          temp,
          references,
          config
        );
      } else {
        dflt = temp;
      }
    } else {
      dflt = data.dflt;
    }

    if (typeof data.inheritance === "string") {
      let temp = data.inheritance.trim();

      if (ConfigInstructionParser.hasInstructions(temp)) {
        inheritance = ConfigInstructionParser.executeInstructions(
          temp,
          references,
          config
        );
      } else {
        inheritance = InheritanceSchema.create(temp, config, references);
      }
    } else {
      inheritance = InheritanceSchema.create(
        data.inheritance,
        config,
        references
      );
    }

    return {
      inheritance,
      name,
      dflt,
    };
  }

  static parse(
    generic: string | GenericJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): DataProvider<GenericData> {
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

export class GenericSchema {
  public static create(
    generic: DataProvider<GenericData> | GenericJson | string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] }
  ) {
    let data: GenericData;

    if (generic instanceof DataProvider) {
      data = generic.data;
    } else {
      data = GenericDataParser.parse(generic, config, references).data;
    }

    let inheritance;

    if (data.inheritance) {
      inheritance = InheritanceSchema.create(
        new DataProvider(data.inheritance),
        config,
        references
      );
    }

    return new GenericSchema(data.name, inheritance, data.dflt, data.meta);
  }

  constructor(
    public readonly name: string,
    public readonly inheritance?: InheritanceSchema,
    public readonly dflt?: string,
    public readonly meta?: any
  ) {}

  toObject(): GenericSchemaObject {
    const { name, dflt, inheritance, meta } = this;
    return {
      name,
      dflt,
      inheritance: inheritance?.toObject(),
      meta,
    };
  }

  listTypes() {
    const { dflt, inheritance } = this;
    const types = [];
    if (dflt) {
      types.push(dflt);
    }

    if (inheritance) {
      types.push(inheritance);
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
