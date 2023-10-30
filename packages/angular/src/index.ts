import {ComponentsGenerator, ComponentMetadata, Config, ComponentPropertyMetadata} from 'webcomponents-wrappers-core';

interface AngularComponentsOptions {}

export class AngularComponentsGenerator implements ComponentsGenerator {
  constructor(private options: AngularComponentsOptions) {}

  generate(componentsMetadata: ComponentMetadata[], config: Config) {
    const angularComponents = componentsMetadata.map(componentMetadata => new AngularComponent(componentMetadata));
    
    // [...angularComponents, angularModule].forEach(item => item.generate())

    // console.log({
    //   componentsMetadata,
    //   config
    // })
    // @todo generate AngularComponent
    // @todo generate AngularModule
  }
}

class AngularComponent {
  constructor(private componentMetadata: ComponentMetadata) {
    console.log(this.generate());
  }

  get inputs() {
    const createInput = (property: ComponentPropertyMetadata): string => `
    ${ property.description ? `/** ${property.description} */` : '' }
    @Input() ${property.name}: ${property.type.value};
    `.replace('\n', '');

    return this.componentMetadata.properties.map(createInput).join('');
  }

  generate() {
    return `
class ${this.componentMetadata.className} {
${this.inputs}
}
    `
  }
}

class AngularModule {}
