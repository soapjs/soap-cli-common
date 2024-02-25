import { readFileSync } from "fs";

type TextsContent = { [key: string]: string };

export class Texts {
  private static instance: Texts;

  public static load(path?: string): Texts {
    if (!Texts.instance && !path) {
      throw new Error("No instance and no path to inittialize texts");
    }

    if (!Texts.instance) {
      const content = readFileSync(path, "utf-8");
      Texts.instance = new Texts(JSON.parse(content));
    }

    return Texts.instance;
  }

  constructor(private texts: TextsContent) {}

  get(key: string): string {
    return this.texts[key] || key;
  }

  toObject(): TextsContent {
    return { ...this.texts };
  }
}
