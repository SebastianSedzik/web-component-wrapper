import { generateDtsBundle } from "dts-bundle-generator";
import { Config } from "./index";

const removeComments = (content: string): string => {
  return content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
}

const removeClass = (className: string) => (content: string) => {
  // const classPattern = new RegExp(`\\bexport\\s+declare\\s+class\\s+${className}\\s*\\{[\\s\\S]*?\\}\\n*`, 'gm');
  
  // return content.replace(classPattern, '');
  return content.replace(/export declare class .*\{[\w\W]^(export)*\{/gm, '');
}

export const createDtsFile = (config: Config) => (filePath: string, analyzerResult: any): string => {
  const className = analyzerResult[0].declaration.symbol.escapedName;
  
  // @todo allow to pass custom config
  const [result] = generateDtsBundle([{
    filePath
  }]);
  
  // @ts-ignore
  const transform = (...transformers) => value => transformers.reduce((pv, cv) => cv(pv), value);
  
  return transform(
    removeComments,
    // @todo
    // removeClass(className)
    // @todo
    // exportEnums
  )(result);

  // fix enum exports
  // const search = /declare enum (?<enum>\w+)/gm.exec(result);
//   const enums = []
//   const search = /declare enum (?<enum>\w+)/gm; // Your regular expression
//   let match;
//
//   while ((match = search.exec(result)) !== null) {
//     enums.push(match?.groups?.enum);
//   }
//
//   const reexportEnums = enums.map(enumName => `
//   declare type ${enumName}Union = ${enumName} | ${enumName}[keyof typeof ${enumName}];
//   export { ${enumName}Union as ${enumName} };
// `).join('\n');
//
//   return `${result} ${reexportEnums}`;
}
