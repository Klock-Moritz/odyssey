import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Tooltip, type LinkProps } from "@mui/material";
import React from "react";
import { UriTemplateEditor } from "./UriTemplateEditor";
import { Warning } from "@mui/icons-material";
import type { LinkParameters } from "../model/links";

export type HyperlinkProps = LinkProps & {
  href: string,
  parameters?: Partial<LinkParameters>,
  onLinkClick?: (href: string) => void,
  hideUrl?: boolean,
}

export const Hyperlink: React.FC<HyperlinkProps> = ({
  href,
  parameters = {},
  onLinkClick,
  hideUrl = false,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const [expandedTemplate, setExpandedTemplate] = React.useState<string>(href);
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <>
      <Tooltip title={parameters.title && !hideUrl ? href : undefined}>
        <Link href={href} target="_blank" rel="noopener noreferrer" {...props} sx={{
          textDecoration: `${parameters.templated ? "dashed" : "solid"} ${parameters.deprecation ? "line-through underline" : "underline"}`,
        }} onClick={e => {
          if (parameters.templated) {
            e.preventDefault();
            setOpen(true);
          } else if (onLinkClick) {
            e.preventDefault();
            onLinkClick(href);
          }
        }}>
          {"title" in parameters ? parameters.title : href}
        </Link>
      </Tooltip>
      {parameters.deprecation && (
        <Tooltip title={`This link is deprecated. More information might be available at ${parameters.deprecation}.`}>
          <IconButton href={parameters.deprecation} target="_blank" rel="noopener noreferrer"
            size="small" sx={{ ml: 0.5, padding: 0 }}>
            <Warning fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}
      {open && (
        <Dialog open onClose={() => setOpen(false)}>
          <DialogTitle>Link template</DialogTitle>
          <form ref={formRef} onSubmit={e => {
            e.preventDefault();
            setOpen(false);
            if (onLinkClick) {
              onLinkClick(expandedTemplate);
            }
          }}>
            <DialogContent>
              <DialogContentText minWidth="500px" mb={2}>
                Current value: {expandedTemplate}
              </DialogContentText>
              <UriTemplateEditor template={href} onUpdateUri={setExpandedTemplate} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Close</Button>
              <Button href={expandedTemplate} target="_blank" rel="noopener noreferrer" onClick={e => {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }} variant="contained">
                Follow Link
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </>
  )
}