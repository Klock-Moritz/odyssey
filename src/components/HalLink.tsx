import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Tooltip, type LinkProps } from "@mui/material";
import type { HalLink as HalLinkType } from "../lib/hal";
import React from "react";
import { UriTemplateEditor } from "./UriTemplateEditor";
import { Warning } from "@mui/icons-material";

export type HalLinkProps = Omit<LinkProps, 'href'> & {
  link: HalLinkType
  onLinkClick?: (href: string) => void,
}

export const HalLink: React.FC<HalLinkProps> = ({
  link,
  onLinkClick,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const [expandedTemplate, setExpandedTemplate] = React.useState<string>(link.href);
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <>
      <Tooltip title={link.title ? link.href : undefined}>
        <Link href={link.href} target="_blank" rel="noopener noreferrer" {...props} sx={{
          textDecoration: `${link.templated ? "dashed" : "solid"} ${link.deprecation ? "line-through underline" : "underline"}`,
        }} onClick={e => {
          if (link.templated) {
            e.preventDefault();
            setOpen(true);
          } else if (onLinkClick) {
            e.preventDefault();
            onLinkClick(link.href);
          }
        }}>
          {"title" in link ? link.title : link.href}
        </Link>
      </Tooltip>
      {link.deprecation && (
        <Tooltip title={`This link is deprecated. More information might be available at ${link.deprecation}.`}>
          <IconButton href={link.deprecation} target="_blank" rel="noopener noreferrer"
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
              <UriTemplateEditor template={link.href} onUpdateUri={setExpandedTemplate} />
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