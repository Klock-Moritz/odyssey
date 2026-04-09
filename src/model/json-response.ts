import type { JsonSchema, UISchemaElement } from "@jsonforms/core";
import { type TextResponse } from "./text";

export type WithData = {
  data: unknown,
}

export type WithCleanedData = {
  cleanedData: unknown,
}

export type WithObjectData = {
  data: { [key: string]: unknown },
}

export type WithSchemaUris = {
  schemaUri?: string,
  uischemaUri?: string,
}

export type WithSchemata = {
  schema?: JsonSchema,
  uischema?: UISchemaElement,
}

export type JSONResponse = TextResponse & WithData & WithCleanedData
  & WithSchemaUris & WithSchemata

export function hasObjectData<T extends WithData>(response: T): response is T & WithObjectData {
  return typeof response.data === "object" && response.data !== null && !Array.isArray(response.data);
}

export function extractSchemaUrls<T extends WithObjectData>(response: T): T & WithSchemaUris {
  let schemaUri: string | undefined = undefined;
  let uischemaUri: string | undefined = undefined;

  if ("$schema" in response.data && typeof response.data.$schema === "string") {
    schemaUri = response.data.$schema;
  }
  if ("$uischema" in response.data && typeof response.data.$uischema === "string") {
    uischemaUri = response.data.$uischema;
  }
  return {
    ...response,
    schemaUri,
    uischemaUri,
  };
}

export async function fetchAndAttachSchemata<T extends WithSchemaUris>(response: T): Promise<T & WithSchemata> {
  let schema: JsonSchema | undefined = undefined;
  let uischema: UISchemaElement | undefined = undefined;

  if (response.schemaUri) {
    try {
      const schemaResponse = await fetch(response.schemaUri, {
        headers: { "accept": "application/schema+json" },
      });
      schema = await schemaResponse.json();
    } catch (error) {
      console.error("Error fetching schema:", error);
    }

  }

  if (response.uischemaUri) {
    try {
      const uischemaResponse = await fetch(response.uischemaUri, {
        headers: { "accept": "application/prs.json-forms-ui-schema+json" },
      });
      uischema = await uischemaResponse.json();
    } catch (error) {
      console.error("Error fetching UI schema:", error);
    }
  }

  return {
    ...response,
    schema,
    uischema,
  };
}

export function cleanJSONData<T extends WithCleanedData>(response: T): T {
  let cleanedData = response.cleanedData;

  if (typeof cleanedData === "object" && cleanedData !== null && "$schema" in cleanedData) {
    const { $schema, ...rest } = cleanedData;
    cleanedData = rest;
  }
  if (typeof cleanedData === "object" && cleanedData !== null && "$uischema" in cleanedData) {
    const { $uischema, ...rest } = cleanedData;
    cleanedData = rest;
  }

  return {
    ...response,
    cleanedData,
  };
}