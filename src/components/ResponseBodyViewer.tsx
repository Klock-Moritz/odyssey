import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { TabGroup, type TabGroupEntryProps } from "./TabGroup";
import { MediaType } from "../lib/media-type";

export type ResponseBodyViewerProps = {
  response: Response,
  viewers: {
    predicate: (mediaType: MediaType) => boolean,
    renderer: (response: Response, mediaType: MediaType) =>
      Promise<React.ReactElement<TabGroupEntryProps> | React.ReactElement<TabGroupEntryProps>[]>,
  }[]
}

export const ResponseBodyViewer: React.FC<ResponseBodyViewerProps> = ({
  response,
  viewers
}) => {
  const [children, setChildren] = React.useState<React.ReactElement<TabGroupEntryProps>[]>();

  const mediaTypeString = response.headers.get("content-type");
  if (!mediaTypeString) {
    return undefined;
  }
  const mediaType = React.useMemo(() => new MediaType(mediaTypeString), [mediaTypeString]);

  useEffect(() => {
    let cancelled = false;

    async function chooseViewer() {
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

    if (!response.bodyUsed) {
      chooseViewer();
    }

    return () => {
      cancelled = true;
    };
  }, [response, viewers, mediaType])

  if (children === undefined) {
    return;
  } else if (children.length === 0) {
    return (
      <Typography>
        No applicable viewer found for media type <code>
          {mediaType.essence}
        </code>.
      </Typography>
    );
  } else {
    return (
      <TabGroup sx={{ borderBottom: 1, borderColor: 'divider' }}>{children}</TabGroup>
    );
  }

}