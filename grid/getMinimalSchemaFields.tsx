import { ArraySchemaType } from 'sanity';

import {Schema} from '@sanity/schema'

/**
 * Returns a minimal, non-circular list of fields for a given component type name.
 * Instead of returning the entire schema object, it returns a short array with name/title/typeName.
 */
export function getMinimalSchemaFields(
  schemaType: ArraySchemaType,
  componentTypeName: string): { name: string; title?: string; typeName?: string; }[] {
  const gridItemSchema = schemaType?.of?.[0];
  if (!gridItemSchema?.fields) {
    console.log("getMinimalSchemaFields: No fields found in schema");
    return [];
  }

  const componentField = gridItemSchema.fields.find((f: any) => f.name === 'component');
  if (!componentField || !componentField.type?.of) {
    console.log("getMinimalSchemaFields: No component field found in schema");
    return [];
  }

  const matchedSubSchema = componentField.type.of.find(
    (def: any) => def.name === componentTypeName
  );
  if (!matchedSubSchema?.fields) {
    console.log("getMinimalSchemaFields: No fields found in matched sub schema");
    return [];
  }

  // Map to minimal structure so we don't introduce circular references
  const result = matchedSubSchema.fields;

  // const compiled = Schema.compile({
  //   name: componentTypeName,
  //   // These are the top-level “types” in your schema:
  //   types: [matchedSubSchema]
  // })

  console.log(`getMinimalSchemaFields: Returning minimal schema fields length: ${result?.length}`);
  return result;
}
