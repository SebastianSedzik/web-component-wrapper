# web-component-wrapper-angular

Generate Angular components from web components library.

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
const { processProject } = require('web-component-wrapper-core');
const { AngularComponentsGenerator } = require('web-component-wrapper-angular');

processProject({
  ...,
  generator: new AngularComponentsGenerator({
    webComponentImportPath: (componentMetadata) => 'components-library',
    /// ... and/or other options from AngularComponentsOptions
  })
});
```
