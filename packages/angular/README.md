# @web-component-wrapper/angular

> [!WARNING]
> CAUTION: This package is currently in the early stages of development, and its API may undergo changes in the future.

Create Angular components from a web component library.

## Specification
### #1 Angular Directive
Each component is designated as an Angular directive instead of a component, eliminating unnecessary wrapper elements.
This ensures transparency to the web component library, as it does not need to be aware of any wrappers.

### #2 Angular Standalone Component
Each component is defined as a standalone Angular component, enabling you to import them into NgModule or other standalone components.

### #3 Each component with separate ng-packagr entry 
Each component establishes its own entry point for `ng-packagr`, eliminating the need to re-export them in the library's public API.
This prevents the library's public API from being polluted with types, events, and interfaces from all components and avoids naming collisions.
```ts
import { TagLitTs, TagRemoveEvent, TagSize } from 'library-angular-components/components/tag-lit-ts';
```

## Supported features
- [X] Description
- [X] Properties/Inputs
- [X] Events/Outputs
- [X] Slots (via docs)
- [X] Css custom properties (via docs)
- [ ] Methods

## Installation
```bash
npm i @web-component-wrapper/angular -D
```

## Configuration
```ts
interface AngularComponentsOptions {}
```

## Usage

```ts
const { processProject } = require('@web-component-wrapper/core');
const { AngularComponentsGenerator } = require('@web-component-wrapper/angular');

processProject({
  ...,
  generator: new AngularComponentsGenerator({
    /// ... and/or other options from AngularComponentsOptions
  })
});
```

## Example
👀 [library-angular-components](https://github.com/SebastianSedzik/web-component-wrapper/blob/master/examples/library-angular-components/projects/library-angular-components) is an example Angular library that generates Angular component for [components-library](https://github.com/SebastianSedzik/web-component-wrapper/blob/master/examples/library)
