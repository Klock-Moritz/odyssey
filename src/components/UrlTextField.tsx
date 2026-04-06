import { TextField, type TextFieldProps } from "@mui/material";
import React from "react";

export type UrlTextFieldProps = TextFieldProps;

export const UrlTextField: React.FC<UrlTextFieldProps> = ({
  ...props
}) => {
  return (
    <TextField {...props} type={props.type ?? "url"} placeholder={props.placeholder ?? "https://"} />
  )
}