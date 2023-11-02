import { ComponentsGenerator, ComponentMetadata, Config, ComponentPropertyMetadata } from 'web-component-wrapper-core';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import kebabCase from "just-kebab-case";

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

export class AngularComponentsGenerator implements ComponentsGenerator {
  private options: AngularComponentsOptions;

  constructor(options: AngularComponentsOptions) {
    this.options = {
      angularComponentTag: ({ className }) => kebabCase(className),
      ...options
    }
  }

  generate(componentsMetadata: ComponentMetadata[], config: Config) {
    const angularComponents = componentsMetadata.map(componentMetadata => new AngularComponent(componentMetadata, this.options));

    [...angularComponents].forEach(item => item.generate(config))

    // console.log({
    //   componentsMetadata,
    //   config
    // })
    // @todo generate AngularComponent
    // @todo generate AngularModule
  }
}

class AngularComponent {
  constructor(private componentMetadata: ComponentMetadata, private options: AngularComponentsOptions) {}
  
  get webComponentClassName(): string {
    return this.componentMetadata.className;
  }

  get webComponentImport(): string {
    return `import {${this.webComponentClassName}} from "${this.options.webComponentImportPath(this.componentMetadata)}";`;
  }

  get tag(): string {
    return this.options.angularComponentTag ? this.options.angularComponentTag(this.componentMetadata) : "";
  }
  
  get webComponentInitializer(): string {
    return `try {
  customElements.define('${this.tag}', class extends ${this.webComponentClassName} {});
} catch (e) {}`
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

  get fileContent(): string {
    return `// Generated by web-component-wrapper
${this.webComponentImport}
import { Directive, Input } from '@angular/core';
${this.componentMetadata.typings}

${this.componentMetadata.description ? `/** ${this.componentMetadata.description} */` : ''}
@Directive({
  selector: '${this.tag}'
})
export class ${this.componentMetadata.className}Component {
${this.inputs}
}

${this.webComponentInitializer}
    `
  }

  generate(config: Config) {
    const destFilePath = join(config.dist, 'components', `${this.componentMetadata.className}.component.ts`);

    if (!existsSync(dirname(destFilePath))) {
      mkdirSync(dirname(destFilePath), { recursive: true });
    }

    writeFileSync(destFilePath, this.fileContent, { encoding: 'utf-8'});
  }
}

class AngularModule {}
