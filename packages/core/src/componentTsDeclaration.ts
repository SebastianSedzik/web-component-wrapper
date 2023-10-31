import { generateDtsBundle } from "dts-bundle-generator";
import { Config } from "./index";

// @todo: description
const removeComments = (content: string): string => {
  return content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
}

// @todo: description
const removeClass = (className: string) => (content: string) => {
  const pattern = `(?<classDeclaration>export declare class ${className} [\\w\\W]*)(export \\{)`;
  const search = new RegExp(pattern, 'gm').exec(content);

  if (search?.groups?.classDeclaration) {
    return content.replace(search?.groups?.classDeclaration, '');
  }

  return content;
}

// @todo: description
const exportEnums = (content: string): string => {
  const regex = /^(?!.*\bexport\b).*declare\s+enum/gm;
  
  return content.replace(regex, 'export enum');
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
    removeClass(className),
    exportEnums
  )(result);
}
