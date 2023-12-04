import { ComponentsGenerator, ComponentMetadata, Config } from '@web-component-wrapper/core';
import { AngularComponent } from './component';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AngularComponentsOptions {}

export class AngularComponentsGenerator implements ComponentsGenerator {
  private readonly options: AngularComponentsOptions;
  
  constructor(options: AngularComponentsOptions) {
    this.options = { ...options }
  }

  async generate(componentsMetadata: ComponentMetadata[], config: Config) {
    const generateAngularComponentsTasks = componentsMetadata.map(componentMetadata => new AngularComponent(componentMetadata, config).generate());

    const tasks = [
      ...generateAngularComponentsTasks
    ]

    await Promise.all(tasks);
  }
}
