import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { TabGroup, type TabGroupEntryProps } from "./TabGroup";
import { MediaType } from "../utils/media-type";
import { type ProcessedResponse } from "../model/response-pipeline";
import type { WithContentType } from "../model/content-type";
import type { WithText } from "../model/text";

export type ResponseWithBody = ProcessedResponse & WithContentType & WithText;

export type ResponseBodyViewerProps = {
  response: ResponseWithBody,
  viewers: {
    predicate: (mediaType: MediaType) => boolean,
    renderer: (response: ResponseWithBody, mediaType: MediaType) =>
      Promise<React.ReactElement<TabGroupEntryProps> | React.ReactElement<TabGroupEntryProps>[]>,
  }[]
}

export const ResponseBodyViewer: React.FC<ResponseBodyViewerProps> = ({
  response,
  viewers
}) => {
  const [children, setChildren] = React.useState<React.ReactElement<TabGroupEntryProps>[]>();

  useEffect(() => {
    let cancelled = false;

    if (!("contentType" in response)) {
      return undefined;
    }

    async function chooseViewer(mediaType: MediaType) {
      for (const viewer of viewers) {
        if (viewer.predicate(mediaType)) {
          const entries = await viewer.renderer(response, mediaType);
          if (!cancelled) {
            setChildren(Array.isArray(entries) ? entries : [entries]);
          }
          return;
        }
      }
      if (!cancelled) {
        setChildren([]);
      }
    }

    chooseViewer(response.contentType);

    return () => {
      cancelled = true;
    };
  }, [response, viewers])

  if (children === undefined || !("contentType" in response)) {
    return;
  } else if (children.length === 0) {
    return (
      <Typography>
        No applicable viewer found for media type <code>
          {response.contentType?.essence}
        </code>.
      </Typography>
    );
  } else {
    return (
      <TabGroup sx={{ borderBottom: 1, borderColor: 'divider' }}>{children}</TabGroup>
    );
  }

}