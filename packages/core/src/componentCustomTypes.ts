import { generateDtsBundle } from "dts-bundle-generator";
import { extname } from 'path';
import { TypescriptConfig } from "./index";

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

const transform = (...transformers: any[]) => (value: any) => transformers.reduce((pv, cv) => cv(pv), value);

export const getCustomTypes = (config?: TypescriptConfig) => (filePath: string, analyzerResult: any): string => {
  if (extname(filePath) !== '.ts') {
    return ""
  }

  const className = analyzerResult[0].declaration.symbol.escapedName;
  const entryPoints = [filePath, ...(config?.includes ?? [])].map(filePath => ({ filePath }));
  const [result] = generateDtsBundle(entryPoints, {
    preferredConfigPath: config?.project
  });

  return transform(
    removeComments,
    removeClass(className),
    exportEnums
  )(result);
}
