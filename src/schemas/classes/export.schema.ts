import { DataProvider } from "../../data-provider";
import { ExportData, ExportJson } from "../types";

export class ExportDataParser {
  static parse(exp?: string | boolean | ExportJson): DataProvider<ExportData> {
    let data;
    if (exp === true) {
      data = {
        is_default: false,
        use_wildcard: false,
        path: "",
        list: [],
        alias: "",
      };
    }

    if (exp === "default") {
      data = {
        is_default: true,
        use_wildcard: false,
        path: "",
        list: [],
        alias: "",
      };
    }

    if (exp && typeof exp === "object") {
      data = {
        is_default: exp.is_default,
        use_wildcard: exp.use_wildcard,
        path: exp.path,
        list: exp.list,
        alias: exp.alias,
      };
    }

    return new DataProvider(data);
  }
}

export class ExportSchema {
  public static create(
    exp: string | boolean | ExportJson | DataProvider<ExportData>
  ) {
    let data: ExportData;

    if (exp instanceof DataProvider) {
      data = exp.data;
    } else {
      data = ExportDataParser.parse(exp).data;
    }

    return new ExportSchema(
      data.is_default || false,
      data.use_wildcard || false,
      data.path || "",
      data.list || [],
      data.alias || ""
    );
  }

  constructor(
    public readonly isDefault: boolean,
    public readonly useWildcard: boolean,
    public readonly path: string,
    public readonly list: string[],
    public readonly alias: string
  ) {}

  toObject() {
    const {
      isDefault: is_default,
      useWildcard: use_wildcard,
      path,
      list,
      alias,
    } = this;

    return {
      is_default,
      use_wildcard,
      path,
      alias,
      list,
    };
  }
}
