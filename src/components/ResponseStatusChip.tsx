import { Chip, type ChipProps } from "@mui/material";
import type React from "react";

export type ResponseStatusChipProps = ChipProps & {
  status: number,
  statusText: string,
}

export const ResponseStatusChip: React.FC<ResponseStatusChipProps> = ({
  status,
  statusText,
  ...props
}) => {
  return (
    <Chip {...props} label={`${status} ${statusText}`} color={mapColor(status)} />
  )
}

function mapColor(status: number) {
  if (status < 100) {
    return "default";
  } else if (status < 200) {
    return "info";
  } else if (status < 300) {
    return "success";
  } else if (status < 400) {
    return "default";
  } else if (status < 500) {
    return "error";
  } else if (status < 600) {
    return "warning";
  } else {
    return "default";
  }
}