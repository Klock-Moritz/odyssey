import { Stack, TextField, type StackProps } from "@mui/material";
import React from "react";
import uriTemplates from "uri-templates";

export type UriTemplateEditorProps = StackProps & {
  template: string,
  onUpdateUri?: (uri: string) => void,
}

export const UriTemplateEditor: React.FC<UriTemplateEditorProps> = ({
  template,
  gap = 1,
  onUpdateUri,
  ...props
}) => {
  const uriTemplate = uriTemplates(template);
  const [params, setParams] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    onUpdateUri?.(uriTemplate.fill(params));
  }, [params]);

  function updateParams(newParams: Record<string, string>) {
    const mergedParams = { ...params, ...newParams };
    setParams(mergedParams);
  }

  return (
    <Stack {...props} gap={gap}>
      {uriTemplate.varNames.map(variable => (
        <TextField key={variable} label={variable}
          slotProps={{
            inputLabel: {
              size: "small",
            }
          }}
          value={params[variable] || null}
          onChange={(e) => updateParams({ [variable]: e.target.value })} />
      ))}
    </Stack>
  )
}