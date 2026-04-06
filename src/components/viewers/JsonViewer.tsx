import { JsonForms } from "@jsonforms/react";
import {
  materialRenderers,
  materialCells,
} from '@jsonforms/material-renderers';
import React from "react";
import type { JsonSchema, UISchemaElement } from "@jsonforms/core";

export type JsonViewerProps = {
  data: any,
  schema?: JsonSchema,
  uischema?: UISchemaElement,
};

export const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  schema,
  uischema,
}) => {
  return (
    <JsonForms readonly schema={schema} uischema={uischema} data={data} renderers={materialRenderers} cells={materialCells} />
  );
};