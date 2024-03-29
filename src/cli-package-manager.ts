import { existsSync } from "fs";
import { workerLog } from "./tools";

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

export class CliPackageManager {
  private globalPackagesPath: string;

  constructor() {
    this.globalPackagesPath = path.join(os.homedir(), ".soap", "libs");
    if (!fs.existsSync(this.globalPackagesPath)) {
      fs.mkdirSync(this.globalPackagesPath, { recursive: true });
    }
  }

  public installPackage(packageName: string) {
    return new Promise((resolve, reject) => {
      const command = `npm install ${packageName} --prefix "${this.globalPackagesPath}"`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Could not install package ${packageName}: ${error}`);
          return;
        }
        console.log(`Package ${packageName} installed successfully.`);
        resolve(stdout);
      });
    });
  }

  public getPackageVersion(packageName: string) {
    try {
      const [name] = packageName.split("@");
      const packageJsonPath = path.join(
        this.globalPackagesPath,
        "node_modules",
        name,
        "package.json"
      );
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      return packageJson.version;
    } catch (error) {
      console.error(
        `Could not get version for package ${packageName}: ${error}`
      );
      return null;
    }
  }

  public removePackage(packageName: string) {
    return new Promise((resolve, reject) => {
      const command = `npm uninstall ${packageName} --prefix "${this.globalPackagesPath}"`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Could not remove package ${packageName}: ${error}`);
          return;
        }
        console.log(`Package ${packageName} removed successfully.`);
        resolve(stdout);
      });
    });
  }

  public requirePackage<T = any>(packageName: string): T {
    try {
      const packagePath = path.join(
        this.globalPackagesPath,
        "node_modules",
        packageName
      );
      return require(packagePath);
    } catch (error) {
      workerLog(error);
      console.error(`Could not load package ${packageName}: ${error}`);
      return null;
    }
  }

  public hasPackage(packageName: string) {
    try {
      const [name] = packageName.split("@");
      const packagePath = path.join(
        this.globalPackagesPath,
        "node_modules",
        name
      );
      return existsSync(packagePath);
    } catch (error) {
      console.error(`Could not check package ${packageName}: ${error}`);
      return null;
    }
  }
}
