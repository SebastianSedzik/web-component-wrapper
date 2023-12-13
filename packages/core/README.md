# @web-component-wrapper/core

> [!WARNING]
> CAUTION: This package is currently in the early stages of development, and its API may undergo changes in the future.

`@web-component-wrapper/core` extracts metadata (properties, events, slots, CSS custom properties) and types (TypeScript interfaces, enums, etc.)
from the source files of web components.
This information is then passed to the generator selected by user, which is responsible for converting the metadata into framework-specific code and files.

## Installation
```bash
npm i @web-component-wrapper/core -D
```

## Generators
Select which generator you want to use:
- [Angular](https://github.com/SebastianSedzik/web-component-wrapper/blob/master/packages/angular/README.md) [WIP]

### Create custom generator
To create a custom generator, you need to implement the `ComponentsGenerator` interface.
```ts
import { ComponentsGenerator, ComponentMetadata, Config } from '@web-component-wrapper/core';

export class MyGenerator implements ComponentsGenerator {
    generate(componentMetadata: ComponentMetadata[], config: Config): Promise<void> | void {
        // Your implementation
    }
}
```

## Configuration
```ts
export interface Config {
  /**
   * The source files to process. It should point to web-component source files.
   * I.e "src/**.ts" or ["src/my-button.ts", "src/my-input.ts"]
   */
  src: string | string[]
  /**
   * The destination directory, where the generated files will be placed.
   */
  dist: string,
  /**
   * Function for filtering web components for wrapper generation.
   * Use it to exclude components that are not ready or intended for internal use only.
   * By default, all components are included.
   * Example usage:
   *   filter: (filePath, componentMetadata) => !componentMetadata.sourceFile.text.includes('// web-component-wrapper-disable')
   */
  filter?: (filePath: string, componentMetadata: any) => boolean,
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
```

## Usage

### Generate config file
```ts
const { processProject } = require('@web-component-wrapper/core');
const { paramCase } = require('change-case');

processProject({
  src: '../../my-component-library/src/**/*.ts',
  dist: './generated-components',
  webComponentProvider: ({ className }) => {
    // Example: Library with named exports that require manual component registration
    const tagName = paramCase(className);

    return {
      code: `
        import { ${className} } from "my-component-library";
        
        try {
          customElements.define("${tagName}", class extends ${className} {});
        } catch (e) {}
      `,
      tagName
    }
  },
  typescript: {
    project: '../../my-component-library/tsconfig.json',
    includes: [
      '../../my-component-library/src/globals.ts'
    ]
  },
  generator: new FrameworkSpecificGenerator(options) // select right generator
});
```

### Run generator
```bash
node ./path/to/config/file.js
```
