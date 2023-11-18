export interface ComponentPropertyMetadata {
    name: string;
    type: string; // maybe type should be an object? { resolvedType: string, originalType: string, isEnum: boolean, isAvailable: boolean }
    description?: string;
    default?: any;
}

export interface ComponentEventMetadata {
  name: string;
  type: string; // maybe type should be an object? { resolvedType: string, originalType: string, isEnum: boolean, isAvailable: boolean }
  description?: string;
}

export interface ComponentMetadata {
  className: string;
  description?: string;
  typings?: string;
  properties: ComponentPropertyMetadata[];
  events: ComponentEventMetadata[];
}

interface MapToComponentMetadata {
  componentSchema: any;
  componentTypings?: string;
}

export const mapToComponentMetadata = ({componentSchema, componentTypings}: MapToComponentMetadata): ComponentMetadata => {
  const componentDeclaration = componentSchema?.[0]?.declaration;

  return {
    className: mapToComponentClassName(componentDeclaration),
    typings: componentTypings,
    description: mapToComponentDescription(componentDeclaration),
    properties: mapToComponentProperties(componentDeclaration), // @todo check if type is available in typings
    events: mapToComponentEvents(componentDeclaration) // @todo check if type is available in typings
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
  
  if (!members) {
    return []
  }

  const isPublic = (member: any) => member.visibility === undefined || member.visibility === "public";
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

const mapToComponentEvents = (componentDeclaration: any): ComponentEventMetadata[] => {
  const { events } = componentDeclaration;
  
  if (!events) {
    return []
  }

  return events.map((member: any): ComponentEventMetadata => ({
    name: member.name,
    description: member.jsDoc?.description,
    type: mapToComponentPropertyType(member)
  }));
}

const mapToComponentPropertyType = (member: any): string => {
  const results = /\{(?<kind>\w*):(?<value>.*)\}/g.exec(member.type);

  return results?.groups?.value ?? "any";
}
