export interface ComponentPropertyTypeMetadata {
  kind: 'simple' | 'custom';
  value: string | undefined; // 'string', 'number', 'ComponentType.CustomType'
}

export interface ComponentPropertyMetadata {
    name: string;
    type: ComponentPropertyTypeMetadata;
    description?: string;
    default?: any;
}

export interface ComponentMetadata {
  // @todo d.ts declaration file path;
  className: string;
  // customTypesPath?: string;
  properties: ComponentPropertyMetadata[]
}

export const mapToComponentMetadata = (analyzerResult: any): ComponentMetadata => {
  const componentDeclaration = analyzerResult?.[0]?.declaration;

  // if (!declarations) {
  //   return null;
  // }

  return {
    className: mapToComponentClassName(componentDeclaration),
    properties: mapToComponentProperties(componentDeclaration)
  }
}

const mapToComponentClassName = (componentDeclaration: any): string => {
  return componentDeclaration.symbol.escapedName;
}

const mapToComponentProperties = (componentDeclaration: any): ComponentPropertyMetadata[] => {
  const { members } = componentDeclaration;
  const isProperty = (member: any) => member.kind === "property";
  const isStatic = (member: any) => member.modifiers?.includes("static");
  const nonStaticProperties = members.filter((member: any) => isProperty(member) && !isStatic(member));

  return nonStaticProperties.map((member: any): ComponentPropertyMetadata => ({
    name: member.propName,
    description: member.jsDoc?.description,
    default: member.default,
    type: mapToComponentPropertyType(member)
  }));
};

const mapToComponentPropertyType = (member: any): ComponentPropertyTypeMetadata => {
  const results = /\{(?<kind>.*)\:(?<value>.*)\}/g.exec(member.type);

  const isSimpleType = (kind: string | undefined, value: string | undefined) => {
    const simpleTypes: string[] = [
      'string',
      'number'
      // @todo all types
    ];

    return kind === 'SIMPLE_TYPE' || simpleTypes.includes(value as string);
  }
  
  const kind = isSimpleType(results?.groups?.kind, results?.groups?.value) ? 'simple' : 'custom'

  return {
    kind,
    value: kind === 'simple' ? results?.groups?.value : `ComponentTypes.${results?.groups?.value}`
  }
}
