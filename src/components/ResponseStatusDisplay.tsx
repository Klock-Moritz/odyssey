import { Stack, Typography, type StackProps } from "@mui/material";
import type React from "react";
import { ResponseStatusChip } from "./ResponseStatusChip";

export type ResponseStatusDisplayProps = StackProps & {
  status: number,
  statusText: string,
  url: string,
  redirected: boolean,
}

export const ResponseStatusDisplay: React.FC<ResponseStatusDisplayProps> = ({
  status,
  statusText,
  url,
  redirected,
  ...props
}) => {
  return (
    <Stack {...props} direction="row" alignItems="center" spacing={2}>
      <ResponseStatusChip status={status} statusText={statusText} />
      <Typography fontSize="1rem"><code>{url}</code></Typography>
      {redirected && <Typography>[Redirected]</Typography>}
    </Stack>
  )
}