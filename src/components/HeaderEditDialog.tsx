import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Stack, TextField, type DialogProps } from "@mui/material";
import type React from "react";

export type HeaderEditDialogProps = DialogProps & {
  headerName?: string,
  defaultValue?: string,
  onSubmitted?: (name: string, value: string) => void,
  onClose?: () => void;
}

export const HeaderEditDialog: React.FC<HeaderEditDialogProps> = ({
  headerName,
  defaultValue,
  onSubmitted,
  onClose,
  ...props
}) => {

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onSubmitted) {
      const formData = new FormData(event.currentTarget);
      onSubmitted(headerName ?? String(formData.get("name")),
        String(formData.get("value")));
    }
    if (onClose) {
      onClose();
    }
  }

  return (
      <Dialog {...props} onClose={onClose}>
        <form onSubmit={handleSubmit}>
            <DialogTitle>{headerName ? "Edit" : "Create"} Request Header</DialogTitle>
            <DialogContent>
              <DialogContentText>
                For more information, consult the <Link href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers">list of HTTP headers</Link>  (MDN Web Docs).
              </DialogContentText>
              <Stack gap={2} marginTop={1}>
                <TextField disabled={headerName !== undefined} size="small"
                  name="name" label="Header name" required value={headerName} />
                <TextField size="small" name="value" label="Header value"
                  required defaultValue={defaultValue} />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">Submit</Button>
            </DialogActions>
        </form>
      </Dialog>
  )
}