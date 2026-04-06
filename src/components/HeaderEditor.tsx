import { Chip, Stack, type StackProps } from "@mui/material";
import React from "react";
import { Add } from "@mui/icons-material";
import { HeaderEditDialog } from "./HeaderEditDialog";
import { LabeledValueChip } from "./LabeledValueChip";

export type HeaderEditorProps = Omit<StackProps, "defaultValue"> & {
  value?: Headers,
  defaultValue?: Headers,
  onUpdateHeaders?: (headers: Headers) => void,
}

export const HeaderEditor: React.FC<HeaderEditorProps> = ({
  value,
  defaultValue,
  direction = "row",
  gap = 1,
  flexWrap = "wrap",
  width = "100%",
  onUpdateHeaders,
  ...props
}) => {
  const [internalHeaders, setHeaders] = React.useState(defaultValue || new Headers());
  const headers = value || internalHeaders;

  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogHeaderName, setDialogHeaderName] = React.useState<string | undefined>();
  const [dialogValue, setDialogValue] = React.useState<string | undefined>();
  const [dialogFunction, setDialogFunction] = React.useState<(name: string, value: string) => void>();

  function updateHeaders(updateFunction: (headers: Headers) => void) {
    const newHeaders = new Headers(headers);
    updateFunction(newHeaders);

    if (!value) {
      setHeaders(newHeaders);
    }

    if (onUpdateHeaders) {
      onUpdateHeaders(newHeaders);
    }
  }

  function openCreateDialog() {
    setDialogHeaderName(undefined);
    setDialogValue(undefined);
    setDialogFunction(() => (name: string, value: string) =>
      updateHeaders(headers => headers.append(name, value)));
    setOpenDialog(true);
  }

  function openEditDialog(name: string, value: string) {
    setDialogHeaderName(name);
    setDialogValue(value);
    setDialogFunction(() => (name: string, value: string) =>
      updateHeaders(headers => headers.set(name, value)));
    setOpenDialog(true);
  }

  return (
    <>
      <Stack {...props} direction={direction}
        gap={gap} flexWrap={flexWrap} width={width}>
        {Array.from(headers.entries()).map(header => (
          <LabeledValueChip label={header[0]} value={header[1]}
            onDelete={() => updateHeaders(h => h.delete(header[0]))}
            onClick={() => openEditDialog(header[0], header[1])} />
        ))}
        <Chip icon={<Add />} label="Add Header" color="primary"
          onClick={openCreateDialog} variant="outlined" />
      </Stack>
      <HeaderEditDialog open={openDialog} headerName={dialogHeaderName}
        defaultValue={dialogValue} onSubmitted={dialogFunction}
        onClose={() => setOpenDialog(false)} />
    </>
  )
}