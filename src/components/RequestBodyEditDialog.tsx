import type { DialogProps } from "@mui/material";
import { Stack, Dialog, DialogActions, DialogTitle, Button, DialogContent, Autocomplete, TextField, Typography } from "@mui/material";
import type { BodyContent } from "./RequestBodyEditor";
import { TabGroup, type TabGroupEntryProps } from "./TabGroup";
import React, { useEffect } from "react"
import { MediaType } from "../utils/media-type";

export type EditorDefinition = {
  predicate: (contentType: MediaType) => boolean,
  renderer: (updateBody: (body: BodyInit) => void, body: BodyInit | undefined, contentType: MediaType) =>
    Promise<{
      editor: React.ReactElement<TabGroupEntryProps> | React.ReactElement<TabGroupEntryProps>[],
      initialBody: BodyInit,
    }>
}

export type RequestBodyEditDialogProps = DialogProps & {
  bodyContent: BodyContent | null,
  onSubmitted?: (content: BodyContent) => void,
  onClose?: () => void,
  editors: EditorDefinition[],
  onDirectRequest?: () => void,
}

export const RequestBodyEditDialog: React.FC<RequestBodyEditDialogProps> = ({
  bodyContent,
  onSubmitted = () => { },
  onClose = () => { },
  editors,
  onDirectRequest,
  ...props
}) => {
  const [contentType, setContentType] = React.useState(bodyContent?.contentType);
  const [body, setBody] = React.useState(bodyContent?.body);
  const [children, setChildren] = React.useState<React.ReactElement<TabGroupEntryProps>[]>();

  async function clearEditor() {
    setChildren(undefined);
    setContentType(undefined);
    setBody(undefined);
  }

  async function chooseEditor(contentType: string) {
    const mediaType = new MediaType(contentType);
    for (const editor of editors) {
      if (editor.predicate(mediaType)) {
        const renderer = await editor.renderer(setBody, body ?? undefined, mediaType);
        setContentType(contentType);
        setBody(renderer.initialBody);
        setChildren(Array.isArray(renderer.editor) ? renderer.editor : [renderer.editor]);
        return;
      }
    }
    setContentType(contentType);
    setChildren([]);
  }

  useEffect(() => {
    if (bodyContent) {
      chooseEditor(bodyContent.contentType);
    }
  }, [bodyContent]);

  function createSubmissionFunction(directRequest: boolean) {
    return () => {
      if (body && contentType) {
        onSubmitted({ body, contentType });
        onClose();
        if (directRequest) {
          onDirectRequest?.();
        }
      }
    }
  }

  return (
    <Dialog {...props} onClose={onClose}>
      <DialogTitle minWidth={500}>Edit Body</DialogTitle>
      <DialogContent>
        <Stack gap={2} marginTop={1}>
          <Autocomplete freeSolo options={["application/json"]}
            defaultValue={bodyContent?.contentType} size="small"
            renderInput={(params) => <TextField {...params} label="Content Type" />}
            onChange={(_event, value) => value === null ?
              clearEditor() : chooseEditor(value)} />
          {
            (children !== undefined && contentType !== undefined) && (children.length === 0 ? (
              <Typography>
                No applicable editor found for content type <code>
                  {new MediaType(contentType).essence}
                </code>
              </Typography>
            ) : (
              <TabGroup sx={{ borderBottom: 1, borderColor: 'divider' }}>{
                children
              }</TabGroup>
            ))
          }
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={!body || !contentType} onClick={createSubmissionFunction(false)}>Submit</Button>
        <Button disabled={!body || !contentType} variant="contained" onClick={createSubmissionFunction(true)}>Submit + Send</Button>
      </DialogActions>
    </Dialog>
  )
}