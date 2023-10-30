export interface ComponentPropertyMetadata {
    name: string;
    type: string;
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
  
  const isPublic = (member: any) => member.visibility === "public";
  const isProperty = (member: any) => member.kind === "property";
  const isStatic = (member: any) => member.modifiers?.includes("static");
  const nonStaticProperties = members.filter((member: any) => isPublic(member) && isProperty(member) && !isStatic(member));
  
  return nonStaticProperties.map((member: any): ComponentPropertyMetadata => ({
    name: member.propName,
    description: member.jsDoc?.description,
    // @todo handle default value
    default: member.default,
    type: mapToComponentPropertyType(member)
  }));
};

const mapToComponentPropertyType = (member: any): string => {
  console.log(member);

  const results = /\{(?<kind>.*)\:(?<value>.*)\}/g.exec(member.type);
  const value = results?.groups?.value;
  
  if (!value) {
    // @todo
    return "any";
  }

  const values = value.split('|').map(value => value.trim());
  
  return values.map(value => {
    const isString = (value: string | undefined) => value?.startsWith('"') && value?.endsWith('"');

    const simpleTypes: string[] = [
      'string',
      'number',
      'boolean',
      'bigint',
      'string[]',
      'number[]',
      'boolean[]',
      'bigint[]'
    ];

    return isString(value) || simpleTypes.includes(value) ? value : `ComponentTypes.${value}`;
  }).join(' | ');
}
