import { writeFileSync } from "fs";

export class NgPackagr {
  static createEntryPoint(dir: string, entryFile: string) {
    const ngPackagrConfig = {
      "lib": { entryFile }
    }
    
    const ngPackagrConfigPath = `${dir}/ng-package.json`;

    writeFileSync(ngPackagrConfigPath, JSON.stringify(ngPackagrConfig, null, 2), 'utf-8');
  }
}
