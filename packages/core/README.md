# web-component-wrapper-core

Generate framework-specific wrappers for your web-component library, to consume it like native one.

## Generators
- [Angular](https://github.com/SebastianSedzik/web-component-wrapper/blob/master/packages/angular/README.md) [WIP]

## Configuration
```ts
interface Config {
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

```ts
// create .js file
const { processProject } = require('web-component-wrapper-core');

processProject({
  src: '../../my-component-library/src/**/*.ts',
  dist: './generated-components',
  typescript: {
    project: '../../my-component-library/tsconfig.json',
    includes: [
      '../../my-component-library/src/globals.ts'
    ]
  },
  generator: new FrameworkSpecificGenerator(options) // select right generator
});
```
