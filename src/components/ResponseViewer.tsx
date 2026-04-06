import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography, type StackProps } from "@mui/material";
import React from "react";
import { HeaderViewer } from "./HeaderViewer";
import { ResponseStatusDisplay } from "./ResponseStatusDisplay";
import { ResponseBodyViewer } from "./ResponseBodyViewer";
import { GenericTextViewer } from "./viewers/GenericTextViewer";
import { JsonViewer } from "./viewers/JsonViewer";
import type { JsonSchema, UISchemaElement } from "@jsonforms/core";
import { CsvViewer } from "./viewers/CsvViewer";
import { TabGroupEntry } from "./TabGroup";
import parseLinks from "../lib/parse-link-header";
import { HyperlinkViewer } from "./HyperlinkViewer";
import { getStructuredMediaTypePredicate } from "../lib/media-type";
import { isHalResource, normalizeHalLinks, type HalResource } from "../lib/hal";
import { HalLinkViewer } from "./viewers/HalLinkViewer";
import { HalEmbeddedViewer } from "./viewers/HalEmbeddedViewer";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export type ResponseViewerProps = StackProps & {
  response: Response;
  onFetchRequest?: (url: string, options?: RequestInit) => void,
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  onFetchRequest,
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
          <HeaderViewer headers={response.headers} />
        </AccordionDetails>
      </Accordion>
      {
        response.headers.has("Link") && (
          <HyperlinkViewer links={parseLinks(response.headers.get("Link")!)}
            onLinkClick={link => onFetchRequest?.(link.url, createRequestInitFromLink(link))} />
        )
      }
      <ResponseBodyViewer response={response} viewers={[
        {
          predicate: mt => mt.type === "application" && mt.innerSubtype === "hal" && mt.structuredSyntaxSuffix === "json",
          renderer: async response => await createHalViewer(await response.json(), onFetchRequest)
        },
        {
          predicate: getStructuredMediaTypePredicate("application", "json"),
          renderer: async response => await createJsonViewers(await response.json())
        },
        {
          predicate: getStructuredMediaTypePredicate("text", "csv"),
          renderer: async (response, mediaType) => createTabularViewers(
            await response.text(), ',',
            mediaType.parameters.get("header") === "present", "Raw CSV"
          ),
        },
        {
          predicate: getStructuredMediaTypePredicate("text", "tab-separated-values"),
          renderer: async response => createTabularViewers(
            await response.text(), '\t', true, "Raw TSV"
          ),
        },
        {
          predicate: () => true,
          renderer: async (response, mediaType) => createTextViewer(
            'Content', await response.text(),
            mediaType.structuredSyntaxSuffix || mediaType.innerSubtype
          )
        }
      ]} />
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

function createTabularViewers(data: string, delimiter: string, header: boolean, textLabel: string) {
  return [
    <TabGroupEntry label="Table">
      <CsvViewer text={data} delimiter={delimiter} header={header} />
    </TabGroupEntry>,
    createTextViewer(textLabel, data)
  ];
}

async function createJsonViewers(data: any, rawData?: any) {
  const rawJsonString = JSON.stringify(rawData ?? data, undefined, 2);
  let schema: JsonSchema | undefined = undefined;
  let uischema: UISchemaElement | undefined = undefined;

  if ("$schema" in data && typeof data.$schema === "string") {
    try {
      schema = await fetch(data.$schema).then(response => response.json())
    } catch (error) {
      console.log(error);
    }
  }

  if ("$uischema" in data && typeof data.$uischema === "string") {
    try {
      uischema = await fetch(data.$uischema).then(response => response.json())
    } catch (error) {
      console.log(error);
    }
  }

  return [
    (typeof data === "object" && Object.keys(data).length === 0) && !schema && !uischema ? null : (
      <TabGroupEntry label="Form">
        <JsonViewer data={cleanJsonObject(data)} schema={schema} uischema={uischema} />
      </TabGroupEntry>
    ),
    createTextViewer("Raw JSON", rawJsonString, "json")
  ].filter(viewer => viewer !== null);
}

function createTextViewer(label: string, data: any, language?: string) {
  return (
    <TabGroupEntry label={label}>
      <GenericTextViewer language={language} data={typeof data === "string" ? data : JSON.stringify(data, undefined, 2)} />
    </TabGroupEntry>
  )
}

export async function createHalViewer(rawData: any,
  onFetchRequest?: (url: string, options?: RequestInit) => void) {
  if (isHalResource(rawData)) {
    const data = cleanHalObject(rawData);
    const viewers = await createJsonViewers(data, rawData);

    if (rawData._embedded) {
      viewers.splice(0, 0, (
        <TabGroupEntry label="Embedded" key="hal-embedded">
          <HalEmbeddedViewer resource={rawData} onLinkClick={(href, _rel, link) =>
            onFetchRequest?.(href, createRequestInitFromLink(link))}
            childViewer={child => createHalViewer(child, onFetchRequest)} />
        </TabGroupEntry>
      ));
    }
    if (rawData._links) {
      const links = normalizeHalLinks(rawData._links);
      viewers.splice(0, 0, (
        <TabGroupEntry label="Links" key="hal-links">
          <HalLinkViewer links={links}
            onLinkClick={(href, _rel, link) =>
              onFetchRequest?.(href, createRequestInitFromLink(link))} />
        </TabGroupEntry>
      ));
    }

    return viewers;
  } else {
    return await createJsonViewers(rawData);
  }
}

function cleanHalObject(data: HalResource): Omit<HalResource, "_links"> {
  const { _links, _embedded, ...rest } = data;

  if (_embedded) {
    const cleanedEmbedded: { [key: string]: HalResource | HalResource[] } = {};
    for (const key in _embedded) {
      if (Array.isArray(_embedded[key])) {
        cleanedEmbedded[key] = _embedded[key].map(cleanHalObject);
      } else {
        cleanedEmbedded[key] = cleanHalObject(_embedded[key]);
      }
    }
    return { ...rest, _embedded: cleanedEmbedded };
  } else {
    return rest;
  }
}

function cleanJsonObject(data: any): Omit<any, "$schema" | "$uischema"> {
  if (typeof data === "object" && data !== null) {
    const { $schema, $uischema, ...rest } = data;
    return rest;
  }
  return data;
}