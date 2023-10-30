import { analyzeSourceFile, transformAnalyzerResult } from "web-component-analyzer";
import ts from 'typescript';
import fastGlob from 'fast-glob';
import { mapToComponentMetadata, ComponentMetadata } from "./componentMetadata";

export { ComponentMetadata, ComponentPropertyMetadata } from './componentMetadata';

export interface Config {
  src: string
  dist: string,
  generator: ComponentsGenerator
}

export interface ComponentsGenerator {
  generate(componentMetadata: ComponentMetadata[], config: Config): void;
}

export const processProject = (config: Config) => {
  const componentsSourceFiles = fastGlob.sync(config.src);
  const componentsMetadata = componentsSourceFiles.map(processFile);
  
  config.generator.generate(componentsMetadata, config);
}

const processFile = (filePath: string): ComponentMetadata => {
  const program = ts.createProgram([filePath], {
    // project: '../ds/tsconfig.json', // @todo read path to project from config?
    // noEmitOnError: true,
    // noImplicitAny: true,
    allowJs: true
  });

  const tsSourceFile = program.getSourceFile(filePath)

  // @todo
  // if (!tsSourceFile) {
  //   return null;
  // }

  // @ts-ignore
  const analyzerResult = analyzeSourceFile(tsSourceFile, { program, ts });
  const debugAnalyzerResult = JSON.parse(transformAnalyzerResult("debug", analyzerResult, program));

  // @todo generate ts types

  return mapToComponentMetadata(debugAnalyzerResult);
}
