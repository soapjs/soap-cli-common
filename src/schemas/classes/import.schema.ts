import path from "path";
import { Config, ConfigInstructionParser } from "../../config";
import { ImportData, ImportJson, ImportSchemaObject } from "../types";
import { DataProvider } from "../../data-provider";

export const IMPORT_REGEX =
  /^(import)?\s*(\w+)?(\s*[,]?\s*\{\s*([a-zA-Z, ]+)\s*\})?(\s*\*\s+as\s+(\w+))?\s+from\s+["']([a-zA-Z0-9\/\\\._]+)["'];?$/;

export class ImportDataParser {
  private static parseString(
    impt: string,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: string
  ) {
    let dflt;
    let path;
    let alias;
    let list = [];
    const temp: any = { list: [] };
    const match = impt.match(IMPORT_REGEX);

    if (match) {
      temp.dflt = match[2];
      temp.alias = match[6];
      temp.path = match[7];

      if (match[4]) {
        temp.list.push(...match[4].split(/,\s*/));
      }
    }

    if (ConfigInstructionParser.hasInstructions(temp.dflt)) {
      dflt = ConfigInstructionParser.executeInstructions(
        temp.dflt,
        references,
        config
      );
    } else {
      dflt = temp.dflt;
    }

    if (ConfigInstructionParser.hasInstructions(temp.alias)) {
      alias = ConfigInstructionParser.executeInstructions(
        temp.alias,
        references,
        config
      );
    } else {
      alias = temp.alias;
    }

    if (ConfigInstructionParser.hasInstructions(temp.path)) {
      path = ConfigInstructionParser.executeInstructions(
        temp.path,
        references,
        config
      );
    } else {
      path = temp.path;
    }
    if (Array.isArray(temp.list)) {
      temp.list.forEach((l) => {
        if (ConfigInstructionParser.hasInstructions(l)) {
          list.push(
            ConfigInstructionParser.executeInstructions(l, references, config)
          );
        } else {
          list.push(l);
        }
      });
    }

    return {
      dflt,
      path,
      alias,
      list,
    };
  }

  private static parseJson(
    data: ImportJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ) {
    let dflt;
    let path;
    let alias;
    let list = [];

    if (ConfigInstructionParser.hasInstructions(data.dflt)) {
      dflt = ConfigInstructionParser.executeInstructions(
        data.dflt,
        references,
        config
      );
    } else {
      dflt = data.dflt;
    }

    if (ConfigInstructionParser.hasInstructions(data.alias)) {
      alias = ConfigInstructionParser.executeInstructions(
        data.alias,
        references,
        config
      );
    } else {
      alias = data.alias;
    }

    let tempPath: string;

    if (ConfigInstructionParser.hasInstructions(data.path)) {
      tempPath = ConfigInstructionParser.executeInstructions(
        data.path,
        references,
        config
      );
    } else {
      tempPath = data.path;
    }

    if (tempPath.includes("@") === false && tempPath.includes("/")) {
      path = ImportTools.createRelativeImportPath(data.ref_path, tempPath);
    } else {
      path = tempPath;
    }
    if (Array.isArray(data.list)) {
      data.list.forEach((l) => {
        if (ConfigInstructionParser.hasInstructions(l)) {
          list.push(
            ConfigInstructionParser.executeInstructions(l, references, config)
          );
        } else {
          list.push(l);
        }
      });
    }

    return {
      dflt,
      path,
      alias,
      list,
    };
  }

  static parse(
    method: string | ImportJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
    meta?: any
  ): DataProvider<ImportData> {
    if (typeof method === "string") {
      return new DataProvider<ImportData>(
        this.parseString(method, config, references, meta)
      );
    }

    if (method && typeof method === "object") {
      return new DataProvider<ImportData>(
        this.parseJson(method, config, references, meta)
      );
    }
  }
}

export class ImportTools {
  static createRelativeImportPath(
    componentPath: string,
    dependencyPath: string
  ) {
    const relativePath = path.relative(
      path.dirname(componentPath),
      dependencyPath
    );

    if (!relativePath.startsWith(".") && !relativePath.startsWith("..")) {
      return "./" + relativePath;
    }
    return relativePath;
  }
}

export class ImportSchema {
  public static create(
    impt: string | DataProvider<ImportData> | ImportJson,
    config: Config,
    references?: { [key: string]: unknown; dependencies: any[] },
  ) {
    let data: ImportData;

    if (impt instanceof DataProvider) {
      data = impt.data;
    } else {
      data = ImportDataParser.parse(impt, config, references).data;
    }

    return new ImportSchema(data.dflt, data.path, data.list, data.alias, data.meta);
  }

  constructor(
    public readonly dflt: string,
    public readonly path: string,
    public readonly list: string[],
    public readonly alias: string,
    public readonly meta?: any
  ) {}

  toObject(): ImportSchemaObject {
    const { dflt, path, list, alias, meta } = this;

    return {
      dflt,
      path,
      alias,
      list,
      meta,
    };
  }
}
