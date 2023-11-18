import { generateDtsBundle } from "dts-bundle-generator";
import { extname } from 'path';
import { Config } from "./core";

// @todo: warning/error when missing types (types are not exported)
// @todo: check if dts-bundle-generator is the best option. (check if it's possible to extract even not exported types)
// @todo: unit tests

/**
 * Removes comments from content
 */
const removeComments = (content: string): string => {
  return content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
}

/**
 * Removes class declaration from content
 */
const removeClass = (className: string) => (content: string) => {
  const pattern = `(?<classDeclaration>export declare class ${className} [\\w\\W]*)(export \\{)`;
  const search = new RegExp(pattern, 'gm').exec(content);

  if (search?.groups?.classDeclaration) {
    return content.replace(search?.groups?.classDeclaration, '');
  }

  return content;
}

/**
 * Mark all enums from content as exported
 */
const exportEnums = (content: string): string => {
  const regex = /^(?!.*\bexport\b).*declare\s+enum/gm;
  
  return content.replace(regex, 'export enum');
}

const transform = (...transformers: any[]) => (value: any) => transformers.reduce((pv, cv) => cv(pv), value);

export const extractTypes = (config?: Config) => (filePath: string, analyzerResult: any): string => {
  if (extname(filePath) !== '.ts') {
    return ""
  }

  const className = analyzerResult[0].declaration.symbol.escapedName;
  const entryPoints = [filePath, ...(config?.typescript?.includes ?? [])].map(filePath => ({ filePath }));
  const [result] = generateDtsBundle(entryPoints, {
    preferredConfigPath: config?.typescript?.project
  });

  return transform(
    removeComments,
    removeClass(className),
    exportEnums
  )(result);
}
