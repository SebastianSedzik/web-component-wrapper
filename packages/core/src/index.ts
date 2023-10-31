import { analyzeSourceFile, transformAnalyzerResult } from "web-component-analyzer";
import ts from 'typescript';
import fastGlob from 'fast-glob';
import { mapToComponentMetadata, ComponentMetadata } from "./componentMetadata";
import { getCustomTypes, CustomTypesOptions } from './componentCustomTypes';

export { ComponentMetadata, ComponentPropertyMetadata } from './componentMetadata';

export interface Config {
  src: string
  dist: string,
  generator: ComponentsGenerator,
  customTypes?: CustomTypesOptions
}

export interface ComponentsGenerator {
  generate(componentMetadata: ComponentMetadata[], config: Config): void;
}

export const processProject = (config: Config) => {
  const componentsSourceFiles = fastGlob.sync(config.src);
  const componentsMetadata = componentsSourceFiles.map(processFile(config));
  
  config.generator.generate(componentsMetadata, config);
}

const processFile = (config: Config) => (filePath: string): ComponentMetadata => {
  const program = ts.createProgram([filePath], {
    // project: 'tsconfig.json', // @todo read path to project from config?
    allowJs: true
  });

  const tsSourceFile = program.getSourceFile(filePath);

  // if (!tsSourceFile) {
  //   return null;
  // }

  // @ts-ignore
  const analyzerResult = analyzeSourceFile(tsSourceFile, { program, ts });

  // @todo: do not use transformAnalyzerResult "debug", rather analyze analyzerResult by own
  // @ts-ignore
  const debugAnalyzerResult = JSON.parse(transformAnalyzerResult("debug", analyzerResult, program));
  const customTypes = getCustomTypes(config.customTypes)(filePath, debugAnalyzerResult);

  return mapToComponentMetadata({analyzerResult: debugAnalyzerResult, customTypes});
}


