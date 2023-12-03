import { ComponentsGenerator, ComponentMetadata, Config } from '@web-component-wrapper/core';
import { AngularComponent } from './component';
import { NgPackagr } from './ng-packagr';
import { dirname, basename } from 'path';

export interface AngularComponentsOptions {}

export class AngularComponentsGenerator implements ComponentsGenerator {
  private readonly options: AngularComponentsOptions;
  
  constructor(options: AngularComponentsOptions) {
    this.options = { ...options }
  }

  generate(componentsMetadata: ComponentMetadata[], config: Config) {
    const angularComponents = componentsMetadata.map(componentMetadata => new AngularComponent(componentMetadata, config));

    [...angularComponents].forEach(item => {
      // component file
      item.generate();
      // ng-packagr entry point
      NgPackagr.createEntryPoint(dirname(item.generatedFilePath), basename(item.generatedFilePath));
    })
  }
}
