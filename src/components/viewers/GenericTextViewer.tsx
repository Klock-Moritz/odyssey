import { Editor } from "@monaco-editor/react"
import { ContentCopy } from "@mui/icons-material";
import { Button, ButtonGroup, Stack, type StackProps } from "@mui/material";
import React from "react"

export type GenericTextViewerProps = StackProps & {
  language?: string,
  data: string,
  onUpdateData?: (data: string, keepForEdit: boolean) => void,
}

export const GenericTextViewer: React.FC<GenericTextViewerProps> = ({
  language,
  data,
  onUpdateData,
  alignItems = "end",
  gap = 1,
  height = "500px",
  ...props
}) => {
  const [value, setValue] = React.useState(data);

  return (
    <Stack {...props} height={height} gap={gap} alignItems={alignItems}>
      <ButtonGroup size="small">
        {onUpdateData && (
          <Button onClick={() => onUpdateData?.(value, false)}>
            Send update (PUT)
          </Button>
        )}
        {onUpdateData && (
          <Button onClick={() => onUpdateData?.(value, true)}>
            Edit request
          </Button>
        )}
        {onUpdateData && (
          <Button onClick={() => setValue(data)}>
            Reset
          </Button>
        )}
        <Button endIcon={<ContentCopy fontSize="small" />}
          onClick={() => navigator.clipboard.writeText(String(value))}>
          Copy
        </Button>
      </ButtonGroup>
      <Editor language={language} value={value} options={{
        wordWrap: "on",
        readOnly: onUpdateData === undefined,
      }} onChange={e => setValue(String(e))} />
    </Stack>
  )
}