import { Editor } from "@monaco-editor/react"
import { Box, type BoxProps } from "@mui/material"
import type React from "react"

export type GenericTextViewerProps = BoxProps & {
  language?: string,
  data: any,
}

export const GenericTextViewer: React.FC<GenericTextViewerProps> = ({
  language,
  data,
  height = "500px",
  ...props
}) => {
  return (
    <Box {...props} height={height}>
      <Editor language={language} height="100%" value={data} options={{
        readOnly: true,
        wordWrap: "on",
      }} />
    </Box>
  )
}