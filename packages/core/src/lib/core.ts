import { analyzeSourceFile, transformAnalyzerResult } from "web-component-analyzer";
import ts from 'typescript';
import fastGlob from 'fast-glob';
import { mapToComponentMetadata, ComponentMetadata } from "./componentMetadata";
import { extractTypes } from './componentTypings';

export { ComponentMetadata, ComponentPropertyMetadata, ComponentEventMetadata } from './componentMetadata';

export interface Config {
  /**
   * The source files to process. It should point to web-component source files.
   * I.e "src/**.ts"
   */
  src: string
  /**
   * The destination directory, where the generated files will be placed.
   */
  dist: string,
  /**
   * The generator to use. Use framework specific generator.
   */
  generator: ComponentsGenerator,
  webComponentProvider: (componentMetadata: ComponentMetadata) => {
    /**
     * Function that provides the specific web component from your library and integrates it into the window context.
     * The implementation depends on how your library exposes web components. It may involve:
     * - Importing the component and defining it using customElements.define,
     * - Importing a file with side effects for auto-registration,
     * - No action required if the component is already available globally.
     *
     * Examples:
     * #1: Library with named exports that require manual component registration
     * ```typescript
     * ({ className }) => `
     * import { ${className} } from "my-design-system";
     *
     * try {
     *   customElements.define("${kebabCase(className)}", class extends ${className} {});
     * } catch (e) {}
     * `
     * ```
     *
     * #2: Library with auto-registered components that require importing a file with side effects
     * ```typescript
     * ({ className }) => `
     * import "my-design-system/${className}";
     * `
     * ```
     *
     * #3: Library with globally available components that do not require additional code
     * ```typescript
     * ({ className }) => ``
     * ```
     */
    code: string,
    /**
     * Tag name of the mounted web component
     */
    tagName: string
  },
  /**
   * The TypeScript configuration, if your web-components are written in TypeScript.
   */
  typescript?: {
    /**
     * Path to the tsconfig.json file.
     */
    project?: string,
    /**
     * Additional files to include in the TypeScript program. For example globals files.
     * Please ensure that files listed in `includes` field exports something, otherwise the program will end with an error.
     * The easiest way to do it is to add `export {};` at the end of the file.
     */
    includes?: string[]
  }
}

export interface ComponentsGenerator {
  generate(componentMetadata: ComponentMetadata[], config: Config): Promise<void> | void;
}

export const processProject = async (config: Config) => {
  const componentsSourceFiles = fastGlob.sync(config.src);

  // @todo: improve user notification (use commander)
  console.log('Found files:', componentsSourceFiles.length);

  const componentsMetadata = componentsSourceFiles
    .map(processFile(config))
    .filter(data => data !== null);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await config.generator.generate(componentsMetadata, config);
}

const processFile = (config: Config) => (filePath: string): ComponentMetadata | null => {
  // @todo: improve user notification (use commander)
  console.log(`Process ${filePath}`);

  const program = ts.createProgram([filePath], {
    project: config.typescript?.project,
    allowJs: true
  });

  const tsSourceFile = program.getSourceFile(filePath);
  
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const analyzerResult = analyzeSourceFile(tsSourceFile, { program, ts });

  if (analyzerResult?.componentDefinitions?.length === 0) {
    return null;
  }

  // @todo: improve user notification (use commander)
  console.log('found component', analyzerResult.componentDefinitions[0]?.declaration?.symbol?.escapedName);

  // @todo: do not use transformAnalyzerResult "debug", rather analyze analyzerResult by own
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const componentSchema = JSON.parse(transformAnalyzerResult("debug", analyzerResult, program));
  const componentTypings = extractTypes(config)(filePath, componentSchema);

  return mapToComponentMetadata({componentSchema, componentTypings});
}


