import type { BoxProps } from "@mui/material";
import { Editor } from "@monaco-editor/react"
import { Box } from "@mui/material"

export type GenericTextEditorProps = BoxProps & {
  language?: string,
  initialValue?: string,
  onUpdateValue?: (value: string) => void,
}

export const GenericTextEditor: React.FC<GenericTextEditorProps> = ({
  language,
  initialValue,
  onUpdateValue,
  height = "500px",
  ...props
}) => {
  return (
    <Box {...props} height={height}>
      <Editor language={language} height="100%" defaultValue={initialValue}
        onChange={value => value ? onUpdateValue?.(value) : undefined} options={{
          wordWrap: "on",
        }} />
    </Box>
  )
}