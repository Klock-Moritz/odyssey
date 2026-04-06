import { Clear } from "@mui/icons-material"
import { Button, ButtonGroup, type ButtonGroupProps } from "@mui/material"
import React from "react"
import { RequestBodyEditDialog, type EditorDefinition } from "./RequestBodyEditDialog"

export type BodyContent = {
  contentType: string,
  body: BodyInit,
}

export type RequestBodyEditorProps = ButtonGroupProps & {
  bodyContent?: BodyContent | null,
  defaultBodyContent?: BodyContent | null,
  onUpdateBodyContent?: (content: BodyContent | null) => void,
  editors: EditorDefinition[],
  onDirectRequest?: () => void,
}

export const RequestBodyEditor: React.FC<RequestBodyEditorProps> = ({
  bodyContent,
  defaultBodyContent,
  onUpdateBodyContent,
  editors,
  onDirectRequest,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const [internalContent, setInternalContent] = React.useState(defaultBodyContent ?? null);
  const realContent = bodyContent !== undefined ? bodyContent : internalContent;

  function updateContent(content: BodyContent | null) {
    if (!bodyContent) {
      setInternalContent(content);
    }
    if (onUpdateBodyContent) {
      onUpdateBodyContent(content);
    }
  }

  return (
    <>
      <ButtonGroup {...props}>
        <Button onClick={() => setOpen(true)}>
          {realContent ? "Edit" : "Add"} body
        </Button>
        {realContent && (
          <Button aria-label="delete body"
            onClick={() => updateContent(null)}>
            <Clear />
          </Button>
        )}
      </ButtonGroup>
      {open && (
        <RequestBodyEditDialog open bodyContent={realContent}
          onSubmitted={updateContent} onClose={() => setOpen(false)}
          editors={editors} onDirectRequest={onDirectRequest} />
      )}
    </>
  )
}