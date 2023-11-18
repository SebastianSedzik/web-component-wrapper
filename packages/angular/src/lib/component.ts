import { dirname, join } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { ComponentMetadata, Config, ComponentPropertyMetadata, ComponentEventMetadata } from 'web-component-wrapper-core';
import { AngularComponentsOptions } from "./generator";
import { version } from '../../package.json';
export class AngularComponent {
  constructor(private webComponentMetadata: ComponentMetadata, private options: AngularComponentsOptions) {}
  
  get webComponentClassName(): string {
    return this.webComponentMetadata.className;
  }
  
  get webComponentImport(): string {
    return `import { ${this.webComponentClassName} } from "${this.options.webComponentImportPath(this.webComponentMetadata)}";`;
  }
  
  get webComponentInitializer(): string {
    return `try {
  customElements.define('${this.tag}', class extends ${this.webComponentClassName} {});
} catch (e) {}`
  }
  
  get tag(): string {
    return this.options.angularComponentTag ? this.options.angularComponentTag(this.webComponentMetadata) : "";
  }
  
  get inputs(): string {
    const description = (property: ComponentPropertyMetadata): string => property.description ? `  /** ${property.description} */` : '';
    const inputOptional = (property: ComponentPropertyMetadata): string => `  @Input() ${property.name}!: ${property.type};`;
    const inputDefault = (property: ComponentPropertyMetadata): string => `  @Input() ${property.name}: ${property.type} = ${typeof property.default === 'string' ? `"${property.default}"` : JSON.stringify(property.default) };`;
    
    const createInput = (property: ComponentPropertyMetadata): string => [
      description(property),
      property.default ? inputDefault(property) : inputOptional(property),
      ''
    ].join('\n');
    
    return this.webComponentMetadata.properties.map(createInput).join('');
  }
  
  get outputs(): string {
    const description = (event: ComponentEventMetadata): string => event.description ? `  /** ${event.description} */` : '';
    const output = (event: ComponentEventMetadata): string => `  @Output() "${event.name}" = new EventEmitter<${event.type}>();`;
    
    const createOutput = (event: ComponentEventMetadata): string => [
      description(event),
      output(event),
      ''
    ].join('\n');
    
    return this.webComponentMetadata.events.map(createOutput).join('');
  }
  
  get fileContent(): string {
    return `
// Generated by web-component-angular-wrapper@${version}
import { Directive, Input, Output, EventEmitter } from '@angular/core';
${this.webComponentImport}
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
`;
  }
  
  generate(config: Config) {
    const destFilePath = join(config.dist, 'components', `${this.webComponentMetadata.className}.component.ts`);
    
    if (!existsSync(dirname(destFilePath))) {
      mkdirSync(dirname(destFilePath), { recursive: true });
    }
    
    writeFileSync(destFilePath, this.fileContent, { encoding: 'utf-8'});
  }
}