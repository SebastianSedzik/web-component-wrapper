import {generateDtsBundle, EntryPointConfig, CompilationOptions} from "dts-bundle-generator";

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

export interface CustomTypesOptions {
  entries: EntryPointConfig,
  options?: CompilationOptions
}

const transform = (...transformers: any[]) => (value: any) => transformers.reduce((pv, cv) => cv(pv), value);

export const getCustomTypes = (config?: CustomTypesOptions) => (filePath: string, analyzerResult: any): string => {
  const className = analyzerResult[0].declaration.symbol.escapedName;

  const [result] = generateDtsBundle([{
    filePath,
    ...config?.entries
  }], config?.options);


  return transform(
    removeComments,
    removeClass(className),
    exportEnums
  )(result);
}
