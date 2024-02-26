export type IoC = {
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
  ioc: IoC[];
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

export type PlatformPluginMapItem = {
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
  platforms: PlatformPluginMapItem[];
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
    public readonly platforms: PlatformPluginMapItem[]
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

  getPlatform(alias: string): PlatformPluginMapItem {
    return this.platforms.find((l) => l.alias === alias);
  }

  hasPlatform(alias: string) {
    return this.platforms.findIndex((l) => l.alias === alias) !== -1;
  }

  toObject(): PluginMapObject {
    const { version, languages, databases, web_frameworks, platforms } = this;
    return {
      version,
      languages,
      databases,
      web_frameworks,
      platforms,
    };
  }
}
