import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography, type StackProps } from "@mui/material";
import React from "react";
import { HeaderViewer } from "./HeaderViewer";
import { ResponseStatusDisplay } from "./ResponseStatusDisplay";
import { ResponseBodyViewer, type ResponseWithBody } from "./ResponseBodyViewer";
import { GenericTextViewer } from "./viewers/GenericTextViewer";
import { JsonViewer } from "./viewers/JsonViewer";
import type { JsonSchema, UISchemaElement } from "@jsonforms/core";
import { TabGroupEntry, type TabGroupEntryProps } from "./TabGroup";
import { HyperlinkViewer } from "./HyperlinkViewer";
import { getStructuredMediaTypePredicate, MediaType } from "../utils/media-type";
import { isHalResource, normalizeHalLinks, type HalResource } from "../utils/hal";
import { HalLinkViewer } from "./viewers/HalLinkViewer";
import { HalEmbeddedViewer } from "./viewers/HalEmbeddedViewer";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { ProcessedResponse } from "../model/response-pipeline";
import type { TabularData } from "../model/tabular-data";
import { TableViewer } from "./viewers/TableViewer";

export type ResponseViewerProps = StackProps & {
  response: ProcessedResponse,
  onFetchRequest?: (url: string, options?: RequestInit, keepForEdit?: boolean) => void,
}

const emptyTable: TabularData<string, string> = {
  hasHeader: false,
  header: [],
  records: [],
};

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  onFetchRequest,
  ...props
}) => {
  const updateDataHandler = React.useCallback((data: any, keepForEdit: boolean) => {
    onFetchRequest?.(response.url, {
      method: "PUT",
      headers: {
        "Content-Type": "Content-Type" in response.headers ? response.headers["Content-Type"] : "application/octet-stream",
      },
      body: data,
    }, keepForEdit)
  }, [onFetchRequest, response]);

  const viewers = React.useMemo<{
    predicate: (mediaType: MediaType) => boolean;
    renderer: (response: ResponseWithBody, mediaType: MediaType) => Promise<React.ReactElement<TabGroupEntryProps> | React.ReactElement<TabGroupEntryProps>[]>;
  }[]>(() => [
    {
      predicate: mt => mt.type === "application" && mt.innerSubtype === "hal" && mt.structuredSyntaxSuffix === "json",
      renderer: async response => await createHalViewer(JSON.parse(response.text ?? "null"), onFetchRequest, updateDataHandler)
    },
    {
      predicate: getStructuredMediaTypePredicate("application", "json"),
      renderer: async response => await createJsonViewers(JSON.parse(response.text ?? "null"), undefined, updateDataHandler)
    },
    {
      predicate: getStructuredMediaTypePredicate("text", "csv"),
      renderer: async response => createTabularViewers(
        response.text ?? "", "csv" in response ? response.csv : emptyTable, "Raw CSV", updateDataHandler
      ),
    },
    {
      predicate: getStructuredMediaTypePredicate("text", "tab-separated-values"),
      renderer: async response => createTabularViewers(
        response.text ?? "", "tsv" in response ? response.tsv : emptyTable, "Raw TSV", updateDataHandler
      ),
    },
    {
      predicate: () => true,
      renderer: async (response, mediaType) => createTextViewer(
        'Content', response.text ?? "",
        mediaType.structuredSyntaxSuffix || mediaType.innerSubtype,
        updateDataHandler
      )
    }
  ], [onFetchRequest, updateDataHandler]);

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
            onLinkClick={link => onFetchRequest?.(link.url, createRequestInitFromLink(link.parameters))} />
        )
      }
      {"text" in response && (
        <ResponseBodyViewer response={response} viewers={viewers} />
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

function createTabularViewers(data: string, tabluarData: TabularData<string | number, string>, textLabel: string, onUpdateData?: (data: any, keepForEdit: boolean) => void) {
  return [
    <TabGroupEntry label="Table">
      <TableViewer fields={tabluarData.header.map(String)} rows={tabluarData.records} />
    </TabGroupEntry>,
    createTextViewer(textLabel, data, undefined, onUpdateData)
  ];
}

async function createJsonViewers(data: any, rawData?: any, onUpdateData?: (data: any, keepForEdit: boolean) => void) {
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
    createTextViewer("Raw JSON", rawJsonString, "json", onUpdateData)
  ].filter(viewer => viewer !== null);
}

function createTextViewer(label: string, data: any, language?: string, onUpdateData?: (data: any, keepForEdit: boolean) => void) {
  return (
    <TabGroupEntry label={label}>
      <GenericTextViewer language={language} data={data} onUpdateData={onUpdateData} />
    </TabGroupEntry>
  )
}

export async function createHalViewer(rawData: any,
  onFetchRequest?: (url: string, options?: RequestInit) => void,
  onUpdateData?: (data: any, keepForEdit: boolean) => void) {
  if (isHalResource(rawData)) {
    const data = cleanHalObject(rawData);
    const viewers = await createJsonViewers(data, rawData, onUpdateData);

    if (rawData._embedded) {
      viewers.splice(0, 0, (
        <TabGroupEntry label="Embedded" key="hal-embedded">
          <HalEmbeddedViewer resource={rawData} onLinkClick={(href, _rel, link) =>
            onFetchRequest?.(href, createRequestInitFromLink(link))}
            childViewer={child => createHalViewer(child, onFetchRequest, onUpdateData)} />
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
    return await createJsonViewers(rawData, rawData, onUpdateData);
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