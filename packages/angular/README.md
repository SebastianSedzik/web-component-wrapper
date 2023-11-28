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
   * The designated path for importing the web-component.
   * Generally, it points to the web-component library.
   * For instance: ({className}) => `@my-company/my-design-system`;
   * @param componentMetadata
   */
  webComponentImportPath: (componentMetadata: ComponentMetadata) => string;
  /**
   * The Angular component's tag name.
   * For instance: ({className}) => kebabCase(className)
   * @param componentMetadata
   */
  angularComponentTag?: (componentMetadata: ComponentMetadata) => string;
}
```

## Usage

```ts
const { processProject } = require('@web-component-wrapper/core');
const { AngularComponentsGenerator } = require('@web-component-wrapper/angular');

processProject({
  ...,
  generator: new AngularComponentsGenerator({
    webComponentImportPath: (componentMetadata) => 'components-library',
    /// ... and/or other options from AngularComponentsOptions
  })
});
```

## Example
👀 [library-angular-components](https://github.com/SebastianSedzik/web-component-wrapper/blob/master/examples/library-angular-components) is an example of Angular workspace with library that generates angular-wrappers for [components-library](https://github.com/SebastianSedzik/web-component-wrapper/blob/master/examples/library)
