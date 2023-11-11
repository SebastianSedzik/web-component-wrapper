import { ComponentsGenerator, ComponentMetadata, Config, ComponentPropertyMetadata, ComponentEventMetadata } from 'web-component-wrapper-core';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { paramCase } from 'change-case';

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

    // console.log({
    //   componentsMetadata,
    //   config
    // })
    // @todo generate AngularComponent
    // @todo generate AngularModule
  }
}

class AngularComponent {
  constructor(private webComponentMetadata: ComponentMetadata, private options: AngularComponentsOptions) {}

  get webComponentClassName(): string {
    return this.webComponentMetadata.className;
  }

  get webComponentImport(): string {
    return `import {${this.webComponentClassName}} from "${this.options.webComponentImportPath(this.webComponentMetadata)}";`;
  }

  get webComponentInitializer(): string {
    return `try {
  customElements.define('${this.tag}', class extends ${this.webComponentClassName} {});
} catch (e) {}`
  }

  get tag(): string {
    return this.options.angularComponentTag ? this.options.angularComponentTag(this.webComponentMetadata) : "";
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

    return this.webComponentMetadata.properties.map(createInput).join('');
  }

  get outputs() {
    const outputDescription = (event: ComponentEventMetadata): string => event.description ? `  /** ${event.description} */` : '';
    const outputDeclaration = (event: ComponentEventMetadata): string => `  @Output() "${event.name}" = new EventEmitter<${event.type}>();`;

    const createOutput = (event: ComponentEventMetadata): string => [
      '',
      outputDescription(event),
      outputDeclaration(event),
      ''
    ].join('\n');

    return this.webComponentMetadata.events.map(createOutput).join('');
  }

  // @todo: use handlebars to generate file content
  get fileContent(): string {
    return `// Generated by web-component-wrapper
${this.webComponentImport}
import { Directive, Input, Output, EventEmitter } from '@angular/core';
${this.webComponentMetadata.typings}

${this.webComponentMetadata.description ? `/** ${this.webComponentMetadata.description} */` : ''}
@Directive({
  selector: '${this.tag}'
})
export class ${this.webComponentMetadata.className}Component {
${this.inputs}
${this.outputs}
}

${this.webComponentInitializer}
    `
  }

  generate(config: Config) {
    const destFilePath = join(config.dist, 'components', `${this.webComponentMetadata.className}.component.ts`);

    if (!existsSync(dirname(destFilePath))) {
      mkdirSync(dirname(destFilePath), { recursive: true });
    }

    writeFileSync(destFilePath, this.fileContent, { encoding: 'utf-8'});
  }
}

class AngularModule {}