import { Stack, TextField, type StackProps } from "@mui/material";

export type HeaderViewerProps = StackProps & {
  headers: Headers
}

export const HeaderViewer: React.FC<HeaderViewerProps> = ({
  headers,
  ...props
}) => {
  return (
    <Stack {...props} gap={2}>
      {Array.from(headers.entries()).map(header => (
        <TextField key={`header-${header[0]}`}
          label={header[0]}
          value={header[1]}
          slotProps={{
            input: {
              readOnly: true,
            }
          }} size="small" variant="standard" />
      ))}
    </Stack>
  )
}