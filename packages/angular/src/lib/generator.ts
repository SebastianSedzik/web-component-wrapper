import { ComponentsGenerator, ComponentMetadata, Config } from '@web-component-wrapper/core';
import { paramCase } from 'change-case';
import { AngularComponent } from './component';
import { AngularModule } from './module';

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
  /**
   * The Angular module's class name (name used in the export statement).
   * @default WebComponentsModule
   */
  angularModuleClassName?: string;
}

export class AngularComponentsGenerator implements ComponentsGenerator {
  private readonly options: AngularComponentsOptions;
  
  constructor(options: AngularComponentsOptions) {
    this.options = {
      angularComponentTag: ({ className }) => paramCase(className),
      angularModuleClassName: 'WebComponentsModule',
      ...options
    }
  }

  generate(componentsMetadata: ComponentMetadata[], config: Config) {
    const angularComponents = componentsMetadata.map(componentMetadata => new AngularComponent(componentMetadata, this.options));
    const angularModule = new AngularModule(angularComponents, this.options);

    [...angularComponents, angularModule].forEach(item => item.generate(config))
  }
}
