import React from "react";
import { TabGroup, TabGroupEntry } from "./TabGroup";
import { responsePipeline, type ProcessedResponse } from "../model/response-pipeline";
import { GenericTextViewer } from "./viewers/GenericTextViewer";
import { JsonViewer } from "./viewers/JsonViewer";
import { HalLinkViewer } from "./viewers/HalLinkViewer";
import { HalEmbeddedViewer } from "./viewers/HalEmbeddedViewer";
import { TableViewer } from "./viewers/TableViewer";
import { handleBodyRequest, handleLinkClick, type RequestHandler } from "./ResponseViewer";
import type { HalLink } from "../utils/hal";
import { convertHalLink } from "../model/hal";

export type ViewerDefinition = {
  title: string,
  renderer: (response: ProcessedResponse, handleRequest: RequestHandler) => React.ReactNode,
}

export type ResponseBodyViewerProps = {
  response: ProcessedResponse,
  viewers?: ViewerDefinition[],
  handleRequest?: RequestHandler,
}

export const ResponseBodyViewer: React.FC<ResponseBodyViewerProps> = ({
  response,
  viewers = defaultViewers,
  handleRequest = () => { },
}) => (
  <TabGroup sx={{ borderBottom: 1, borderColor: 'divider' }}>
    {viewers.map(({ title, renderer }) => ({ title, content: renderer(response, handleRequest) }))
      .filter(({ content }) => content !== null).map(({ title, content }) => (
        <TabGroupEntry value={title} key={`response-body-${title}`} label={title}>
          {content}
        </TabGroupEntry>
      ))}
  </TabGroup>
)

export const defaultViewers: ViewerDefinition[] = [
  {
    title: "Table",
    renderer: response => "table" in response ? (
      <TableViewer data={response.table} />
    ) : null
  },
  {
    title: "Data",
    renderer: response => "data" in response ? (
      <JsonViewer data={response.data}
        schema={"schema" in response ? response.schema : undefined}
        uischema={"uischema" in response ? response.uischema : undefined} />
    ) : null
  },
  {
    title: "Links",
    renderer: (response, handleRequest) => "hal" in response && response.hal._links ? (
      <HalLinkViewer links={response.hal._links} onLinkClick={handleHalLinkClick(handleRequest)} />
    ) : null
  },
  {
    title: "Embedded",
    renderer: (response, handleRequest) => "hal" in response && response.hal._embedded ? (
      <HalEmbeddedViewer resource={response.hal} onLinkClick={handleHalLinkClick(handleRequest)}
        childViewerCreator={async (child) => (
          <ResponseBodyViewer viewers={defaultViewers} handleRequest={handleRequest}
            response={await responsePipeline(new Response(JSON.stringify(child), { headers: { "content-type": "application/hal+json" } }))} />)} />
    ) : null
  },
  {
    title: "Raw JSON",
    renderer: (response, handleRequest) => "json" in response ? (
      <GenericTextViewer language="json" data={JSON.stringify(response.json, null, 2)}
        onUpdateData={handleUpdate(handleRequest, response)} />
    ) : null
  },
  {
    title: "Raw Text",
    renderer: (response, handleRequest) => "text" in response && !("data" in response) ? (
      <GenericTextViewer language={
        response.contentType.structuredSyntaxSuffix ?? response.contentType.innerSubtype
      } data={response.text} onUpdateData={handleUpdate(handleRequest, response)} />
    ) : null
  },
  {
    title: "Processed Response",
    renderer: response => process.env.NODE_ENV === "development" ? (
      <GenericTextViewer language="json" data={JSON.stringify(response, null, 2)} />
    ) : null
  },
];

function handleHalLinkClick(handleRequest: RequestHandler) {
  return (href: string, rel: string, link: HalLink) => handleLinkClick(handleRequest)({
    url: href,
    parameters: convertHalLink(rel, link).parameters,
  });
}

function handleUpdate(handleRequest: RequestHandler, response: ProcessedResponse) {
  return handleBodyRequest(handleRequest, "selfLink" in response ? response.selfLink : response.url, {
    method: "PUT",
    headers: {
      "Content-Type": "content-type" in response.headers ? response.headers["content-type"] : "application/octet-stream",
    },
  });
}