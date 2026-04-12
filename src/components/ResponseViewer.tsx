import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography, type StackProps } from "@mui/material";
import React from "react";
import { HeaderViewer } from "./HeaderViewer";
import { ResponseStatusDisplay } from "./ResponseStatusDisplay";
import { ResponseBodyViewer } from "./ResponseBodyViewer";
import { HyperlinkViewer } from "./HyperlinkViewer";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { type ProcessedResponse } from "../model/response-pipeline";
import type { Link } from "../model/links";

export type RequestHandler = (url: string, options?: RequestInit, keepForEdit?: boolean) => void

export type ResponseViewerProps = StackProps & {
  response: ProcessedResponse,
  handleRequest?: RequestHandler,
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  handleRequest = () => { },
  ...props
}) => {
  return (
    <Stack {...props} spacing={2}>
      <ResponseStatusDisplay status={response.status}
        statusText={response.statusText} url={response.url}
        redirected={response.redirected} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Response Headers</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <HeaderViewer headers={new Headers(response.headers)} />
        </AccordionDetails>
      </Accordion>
      {
        "links" in response && response.links.length > 0 && (
          <HyperlinkViewer links={response.links}
            onLinkClick={handleLinkClick(handleRequest)} />
        )
      }
      {"text" in response && (
        <ResponseBodyViewer response={response} handleRequest={handleRequest} />
      )}
    </Stack>
  )
}

function createRequestInitFromLink(link: Record<string, any>): RequestInit {
  const headers: Record<string, string> = {};
  if (link.type) {
    headers["Accept"] = String(link.type);
  }
  if (link.hreflang) {
    headers["Accept-Language"] = String(link.hreflang);
  }

  return {
    method: "GET",
    headers: headers,
  };
}

export function handleLinkClick(handleRequest: RequestHandler) {
  return (link: Link) => {
    handleRequest(link.url, createRequestInitFromLink(link.parameters));
  };
}

export function handleBodyRequest(handleRequest: RequestHandler, url: string, requestInit: RequestInit) {
  return (data: BodyInit, keepForEdit: boolean) => handleRequest(url, { ...requestInit, body: data }, keepForEdit);
}