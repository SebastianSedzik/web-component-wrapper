import { analyzeSourceFile, transformAnalyzerResult } from "web-component-analyzer";
import ts from 'typescript';
import fastGlob from 'fast-glob';
import { mapToComponentMetadata, ComponentMetadata } from "./componentMetadata";
import { extractTypes } from './componentTypings';

export { ComponentMetadata, ComponentPropertyMetadata, ComponentEventMetadata } from './componentMetadata';

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

  console.log('Found files:', componentsSourceFiles.length);

  const componentsMetadata = componentsSourceFiles
    .map(processFile(config))
    .filter(data => data !== null);

  console.log(componentsMetadata);
  
  // @ts-ignore
  config.generator.generate(componentsMetadata, config);
}

const processFile = (config: Config) => (filePath: string): ComponentMetadata | null => {
  console.log(`Process ${filePath}`);

  const program = ts.createProgram([filePath], {
    project: config.typescript?.project,
    allowJs: true
  });

  const tsSourceFile = program.getSourceFile(filePath);
  
  // @ts-ignore
  const analyzerResult = analyzeSourceFile(tsSourceFile, { program, ts });

  if (analyzerResult?.componentDefinitions?.length === 0) {
    return null;
  }
  
  console.log('found component', analyzerResult.componentDefinitions[0]?.declaration?.symbol?.escapedName);

  // @todo: do not use transformAnalyzerResult "debug", rather analyze analyzerResult by own
  // @ts-ignore
  const componentSchema = JSON.parse(transformAnalyzerResult("debug", analyzerResult, program));
  const componentTypings = extractTypes(config.typescript)(filePath, componentSchema);

  return mapToComponentMetadata({componentSchema, componentTypings});
}


