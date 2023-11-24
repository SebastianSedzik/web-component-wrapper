import { ComponentsGenerator, ComponentMetadata, Config } from '@web-component-wrapper/core';
import { paramCase } from 'change-case';
import { AngularComponent } from './component';

export interface AngularComponentsOptions {
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

export class AngularComponentsGenerator implements ComponentsGenerator {
  private readonly options: AngularComponentsOptions;
  
  constructor(options: AngularComponentsOptions) {
    this.options = {
      angularComponentTag: ({ className }) => paramCase(className),
      ...options
    }
  }
  
  generate(componentsMetadata: ComponentMetadata[], config: Config) {
    const angularComponents = componentsMetadata.map(componentMetadata => new AngularComponent(componentMetadata, this.options));
    
    [...angularComponents].forEach(item => item.generate(config))

    // @todo generate AngularModule
  }
}
