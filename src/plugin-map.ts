export type LanguageDI = {
  name: string;
  alias: string;
  packages?: string[];
};

export type LanguagePluginMapItem = {
  name: string;
  alias: string;
  plugin: string;
  packages?: string[];
  cli_plugin?: string;
  cli_plugin_config_url?: string;
  dependency_injection: LanguageDI[];
};

export type DatabasePluginMapItem = {
  name: string;
  alias: string;
  plugins: {
    [language: string]: string;
  };
  packages: {
    [language: string]: string[];
  };
};

export type WebFrameworkPluginMapItem = {
  name: string;
  alias: string;
  plugins: {
    [language: string]: string;
  };
  packages: {
    [language: string]: string[];
  };
};

export type ServicePluginMapItem = {
  name: string;
  alias: string;
  plugins: {
    [language: string]: string;
  };
  packages: {
    [language: string]: string[];
  };
};

export type PluginMapObject = {
  version: string;
  languages: LanguagePluginMapItem[];
  databases: DatabasePluginMapItem[];
  web_frameworks: WebFrameworkPluginMapItem[];
  services: ServicePluginMapItem[];
};

export class ConfigTools {
  static versionToNumber(version: string) {
    return Number(version.replace(/[.-]/g, ""));
  }
}

export class PluginMap {
  constructor(
    public readonly version: string,
    public readonly languages: LanguagePluginMapItem[],
    public readonly databases: DatabasePluginMapItem[],
    public readonly web_frameworks: WebFrameworkPluginMapItem[],
    public readonly services: ServicePluginMapItem[]
  ) {}

  getLanguage(alias: string): LanguagePluginMapItem {
    return this.languages.find((l) => l.alias === alias);
  }

  hasLanguage(alias: string) {
    return this.languages.findIndex((l) => l.alias === alias) !== -1;
  }

  getDatabase(alias: string): DatabasePluginMapItem {
    return this.databases.find((l) => l.alias === alias);
  }

  hasDatabase(alias: string) {
    return this.databases.findIndex((l) => l.alias === alias) !== -1;
  }

  getWebFramework(alias: string): WebFrameworkPluginMapItem {
    return this.web_frameworks.find((l) => l.alias === alias);
  }

  hasWebFramework(alias: string) {
    return this.web_frameworks.findIndex((l) => l.alias === alias) !== -1;
  }

  getService(alias: string): ServicePluginMapItem {
    return this.services.find((l) => l.alias === alias);
  }

  hasService(alias: string) {
    return this.services.findIndex((l) => l.alias === alias) !== -1;
  }

  toObject(): PluginMapObject {
    const { version, languages, databases, web_frameworks, services } = this;
    return {
      version,
      languages,
      databases,
      web_frameworks,
      services,
    };
  }
}
