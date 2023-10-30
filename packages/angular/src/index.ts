import {ComponentsGenerator, ComponentMetadata, Config, ComponentPropertyMetadata} from 'web-component-wrapper-core';

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
    const propertyDescription = (property: ComponentPropertyMetadata): string => property.description ? `  /** ${property.description} */` : '';
    const propertyDeclarationWithoutDefault = (property: ComponentPropertyMetadata): string => `  @Input() ${property.name}!: ${property.type};`;
    const propertyDeclarationWithDefault = (property: ComponentPropertyMetadata): string => `  @Input() ${property.name}: ${property.type} = ${typeof property.default === 'string' ? `"${property.default}"` : JSON.stringify(property.default) };`;
    const propertyDeclaration = (property: ComponentPropertyMetadata): string => property.default ? propertyDeclarationWithDefault(property) : propertyDeclarationWithoutDefault(property);

    const createInput = (property: ComponentPropertyMetadata): string => [
      propertyDescription(property),
      propertyDeclaration(property),
      ''
    ].join('\n');

    return this.componentMetadata.properties.map(createInput).join('');
  }
  
  get template() {
    const attributes = this.componentMetadata.properties.map(property => `[${property.name}]="${property.name}"`).join(' ');
    
    return `<custom-tag ${attributes}></custom-tag>`
  }

  generate() {
    return `
@Component({
  selector: 'custom-tag',
  template: \`${this.template}\`
})
export class ${this.componentMetadata.className} {
${this.inputs}
}
    `
  }
}

class AngularModule {}
