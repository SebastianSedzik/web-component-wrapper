# @web-component-wrapper/angular

> [!WARNING]
> CAUTION: This package is currently in the early stages of development, and its API may undergo changes in the future.

Generate Angular components from web components library.

## Installation
```bash
npm i @web-component-wrapper/angular -D
```

## Configuration
```ts
interface AngularComponentsOptions {
  /**
   * The Angular module's class name (name used in the export statement).
   * @default WebComponentsModule
   */
  angularModuleClassName?: string;
}
```

## Usage

```ts
const { processProject } = require('@web-component-wrapper/core');
const { AngularComponentsGenerator } = require('@web-component-wrapper/angular');

processProject({
  ...,
  generator: new AngularComponentsGenerator({
    angularModuleClassName: 'MyLibraryModule',
    /// ... and/or other options from AngularComponentsOptions
  })
});
```

## Example
👀 [library-angular-components](https://github.com/SebastianSedzik/web-component-wrapper/blob/master/examples/library-angular-components) is an example of Angular workspace with library that generates angular-wrappers for [components-library](https://github.com/SebastianSedzik/web-component-wrapper/blob/master/examples/library)
