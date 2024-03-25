import path from "path";
import { writeFile, readFile } from "fs/promises";
import { Result } from "../../result";
import { Config } from "../config";
import { ConfigJson } from "../config.types";

export class ConfigService {
  private localPath: string;
  constructor(localPath: string) {
    this.localPath = path.join(process.cwd(), localPath);
  }

  async set(json: ConfigJson): Promise<Result<void>> {
    return writeFile(this.localPath, JSON.stringify(json, null, 2), "utf-8")
      .then(() => Result.withoutContent())
      .catch((error) => Result.withFailure(error));
  }

  async get(): Promise<Result<Config>> {
    return readFile(this.localPath, "utf-8")
      .then((json) => {
        return Result.withContent(Config.create(JSON.parse(json)));
      })
      .catch((error) => Result.withFailure(error));
  }
}
