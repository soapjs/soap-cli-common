export type Specs = {
  name: string;
  alias: string;
};

export type Preset = Specs;

export type LanguageSpecs = Specs & {
  packages?: string[];
  soap_modules?: string[];
  soap_cli_modules?: string[];
  presets: Preset[];
};

export type ModuleSpecs = Specs & {
  languages: string[];
  packages: {
    [language: string]: string[];
  };
  soap_modules?: {
    [language: string]: string[];
  };
  soap_cli_modules?: {
    [language: string]: string[];
  };
};

export type ModulesObject = {
  ioc: ModuleSpecs[];
  databases: ModuleSpecs[];
  web_frameworks: ModuleSpecs[];
  test_frameworks: ModuleSpecs[];
  auth_frameworks: ModuleSpecs[];
  docs_frameworks: ModuleSpecs[];
  valid_frameworks: ModuleSpecs[];
  request_collections: ModuleSpecs[];
  platforms: ModuleSpecs[];
  message_brokers: ModuleSpecs[];
};

export type PluginMapObject = ModulesObject & {
  version: string;
  languages: LanguageSpecs[];
};

export class ConfigTools {
  static versionToNumber(version: string) {
    return Number(version.replace(/[.-]/g, ""));
  }
}

export class PluginMap {
  constructor(public readonly object: PluginMapObject) {}

  get version(): string {
    return this.object.version;
  }

  private getBy(
    options: { alias?: string; language?: string },
    type: string
  ): ModuleSpecs {
    if (options.alias) {
      return this.object[type].find((i) => i.alias === options.alias);
    }

    if (options.language) {
      return this.object[type].find((i: ModuleSpecs) =>
        i.languages.includes(options.language)
      );
    }
  }

  getAllLanguageModules(language: string): ModulesObject {
    const result: ModulesObject = {
      ioc: [],
      databases: [],
      web_frameworks: [],
      test_frameworks: [],
      auth_frameworks: [],
      docs_frameworks: [],
      valid_frameworks: [],
      request_collections: [],
      platforms: [],
      message_brokers: [],
    };
    this.object.auth_frameworks.forEach((i: ModuleSpecs) => {
      if (i.languages.includes(language)) {
        result.auth_frameworks.push(i);
      }
    });
    this.object.databases.forEach((i: ModuleSpecs) => {
      if (i.languages.includes(language)) {
        result.databases.push(i);
      }
    });
    this.object.ioc.forEach((i: ModuleSpecs) => {
      if (i.languages.includes(language)) {
        result.ioc.push(i);
      }
    });
    this.object.message_brokers.forEach((i: ModuleSpecs) => {
      if (i.languages.includes(language)) {
        result.message_brokers.push(i);
      }
    });
    this.object.platforms.forEach((i: ModuleSpecs) => {
      if (i.languages.includes(language)) {
        result.platforms.push(i);
      }
    });
    this.object.test_frameworks.forEach((i: ModuleSpecs) => {
      if (i.languages.includes(language)) {
        result.test_frameworks.push(i);
      }
    });
    this.object.web_frameworks.forEach((i: ModuleSpecs) => {
      if (i.languages.includes(language)) {
        result.web_frameworks.push(i);
      }
    });
    this.object.docs_frameworks.forEach((i: ModuleSpecs) => {
      if (i.languages.includes(language)) {
        result.docs_frameworks.push(i);
      }
    });
    this.object.valid_frameworks.forEach((i: ModuleSpecs) => {
      if (i.languages.includes(language)) {
        result.valid_frameworks.push(i);
      }
    });
    this.object.request_collections.forEach((i: ModuleSpecs) => {
      if (i.languages.includes(language)) {
        result.request_collections.push(i);
      }
    });
    return result;
  }

  getLanguage(alias: string): LanguageSpecs {
    return this.object.languages.find((l) => l.alias === alias);
  }

  getDatabase(options: { alias?: string; language?: string }): ModuleSpecs {
    return this.getBy(options, "databases");
  }

  getAuthFramework(options: {
    alias?: string;
    language?: string;
  }): ModuleSpecs {
    return this.getBy(options, "auth_frameworks");
  }

  getDocsFramework(options: {
    alias?: string;
    language?: string;
  }): ModuleSpecs {
    return this.getBy(options, "docs_frameworks");
  }

  getValidFramework(options: {
    alias?: string;
    language?: string;
  }): ModuleSpecs {
    return this.getBy(options, "valid_frameworks");
  }

  getRequestCollection(options: {
    alias?: string;
    language?: string;
  }): ModuleSpecs {
    return this.getBy(options, "request_collections");
  }

  getIoC(options: { alias?: string; language?: string }): ModuleSpecs {
    return this.getBy(options, "ioc");
  }

  getMessageBroker(options: {
    alias?: string;
    language?: string;
  }): ModuleSpecs {
    return this.getBy(options, "message_brokers");
  }

  getPlatform(options: { alias?: string; language?: string }): ModuleSpecs {
    return this.getBy(options, "platforms");
  }

  getTestFramework(options: {
    alias?: string;
    language?: string;
  }): ModuleSpecs {
    return this.getBy(options, "test_frameworks");
  }

  getWebFramework(options: { alias?: string; language?: string }): ModuleSpecs {
    return this.getBy(options, "web_frameworks");
  }

  hasLanguage(alias: string) {
    return this.object.languages.findIndex((l) => l.alias === alias) !== -1;
  }

  hasDatabase(alias: string) {
    return this.object.databases.findIndex((l) => l.alias === alias) !== -1;
  }

  hasWebFramework(alias: string) {
    return (
      this.object.web_frameworks.findIndex((l) => l.alias === alias) !== -1
    );
  }

  hasPlatform(alias: string) {
    return this.object.platforms.findIndex((l) => l.alias === alias) !== -1;
  }

  hasTestFramework(alias: string) {
    return (
      this.object.test_frameworks.findIndex((l) => l.alias === alias) !== -1
    );
  }

  hasAuthFramework(alias: string) {
    return (
      this.object.auth_frameworks.findIndex((l) => l.alias === alias) !== -1
    );
  }

  hasDocsFramework(alias: string) {
    return (
      this.object.docs_frameworks.findIndex((l) => l.alias === alias) !== -1
    );
  }

  hasValidFramework(alias: string) {
    return (
      this.object.valid_frameworks.findIndex((l) => l.alias === alias) !== -1
    );
  }

  hasRequestCollection(alias: string) {
    return (
      this.object.request_collections.findIndex((l) => l.alias === alias) !== -1
    );
  }

  hasIoC(alias: string) {
    return this.object.ioc.findIndex((l) => l.alias === alias) !== -1;
  }

  hasMessageBroker(alias: string) {
    return (
      this.object.message_brokers.findIndex((l) => l.alias === alias) !== -1
    );
  }
}
