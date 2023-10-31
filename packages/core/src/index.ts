import { analyzeSourceFile, transformAnalyzerResult } from "web-component-analyzer";
import ts from 'typescript';
import fastGlob from 'fast-glob';
import { mapToComponentMetadata, ComponentMetadata } from "./componentMetadata";
import { getCustomTypes } from './componentCustomTypes';

export { ComponentMetadata, ComponentPropertyMetadata } from './componentMetadata';

export interface TypescriptConfig {
    project?: string,
    includes?: string[]
}

export interface Config {
  src: string
  dist: string,
  generator: ComponentsGenerator,
  typescript?: TypescriptConfig
}

export interface ComponentsGenerator {
  generate(componentMetadata: ComponentMetadata[], config: Config): void;
}

export const processProject = (config: Config) => {
  const componentsSourceFiles = fastGlob.sync(config.src);

  console.log('Found components:', componentsSourceFiles.length);

  const componentsMetadata = componentsSourceFiles.map(processFile(config));
  
  config.generator.generate(componentsMetadata, config);
}

const processFile = (config: Config) => (filePath: string): ComponentMetadata => {
  console.log(`Process ${filePath}`);

  const program = ts.createProgram([filePath], {
    project: config.typescript?.project,
    allowJs: true
  });

  const tsSourceFile = program.getSourceFile(filePath);
  
  // @ts-ignore
  const analyzerResult = analyzeSourceFile(tsSourceFile, { program, ts });
  // @todo: do not use transformAnalyzerResult "debug", rather analyze analyzerResult by own
  // @ts-ignore
  const debugAnalyzerResult = JSON.parse(transformAnalyzerResult("debug", analyzerResult, program));
  const customTypes = getCustomTypes(config.typescript)(filePath, debugAnalyzerResult);

  return mapToComponentMetadata({analyzerResult: debugAnalyzerResult, customTypes});
}


