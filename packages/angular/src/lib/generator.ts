import { ComponentsGenerator, ComponentMetadata, Config } from '@web-component-wrapper/core';
import { AngularComponent } from './component';
import { AngularModule } from './module';

export interface AngularComponentsOptions {
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
      angularModuleClassName: 'WebComponentsModule',
      ...options
    }
  }

  generate(componentsMetadata: ComponentMetadata[], config: Config) {
    const angularComponents = componentsMetadata.map(componentMetadata => new AngularComponent(componentMetadata, config));
    const angularModule = new AngularModule(angularComponents, this.options, config);

    [...angularComponents, angularModule].forEach(item => item.generate())
  }
}
