export interface ComponentPropertyMetadata {
    name: string;
    type: string;
    description?: string;
    default?: any;
}

export interface ComponentMetadata {
  // @todo d.ts declaration file path;
  className: string;
  description?: string;
  customTypes?: string;
  properties: ComponentPropertyMetadata[]
}

interface MapToComponentMetadata {
  analyzerResult: any;
  tsDeclarations?: string;
}

export const mapToComponentMetadata = ({analyzerResult, tsDeclarations}: MapToComponentMetadata): ComponentMetadata => {
  const componentDeclaration = analyzerResult?.[0]?.declaration;

  // console.log(componentDeclaration);

  // if (!declarations) {
  //   return null;
  // }

  return {
    className: mapToComponentClassName(componentDeclaration),
    customTypes: tsDeclarations,
    description: mapToComponentDescription(componentDeclaration),
    properties: mapToComponentProperties(componentDeclaration)
  }
}

const mapToComponentClassName = (componentDeclaration: any): string => {
  return componentDeclaration.symbol.escapedName;
}

const mapToComponentDescription = (componentDeclaration: any): string => {
  return componentDeclaration.jsDoc?.description;
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
    default: member.default,
    type: mapToComponentPropertyType(member)
  }));
};

const mapToComponentPropertyType = (member: any): string => {
  const results = /\{(?<kind>\w*)\:(?<value>.*)\}/g.exec(member.type);
  const value = results?.groups?.value;

  if (!value) {
    // @todo
    return "any";
  }
  
  return value;
}
