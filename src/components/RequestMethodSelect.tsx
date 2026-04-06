import { MenuItem, Select, type SelectProps } from "@mui/material";
import React from "react";

export type RequestMethodSelectProps = SelectProps<string> & {
  methods?: string[];
}

export const RequestMethodSelect: React.FC<RequestMethodSelectProps> = ({
  methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  ...props
}) => {
  return (
    <Select {...props} defaultValue={props.defaultValue ?? methods[0]}>
      {methods.map(method => (
        <MenuItem key={`method-${method}`} value={method}>{method}</MenuItem>
      ))}
    </Select>
  )
}