import { setProperty, resolve } from "../utils/functions";
import { createMediaType, withContentTypeAsync } from "./content-type";
import { replaceHeaders, withHeaderAsync, withHeaderSet } from "./headers";
import { addData, takeLinkFromProperty } from "./data";
import { extractLinksFromHeader, withFirstLinkSetAsync } from "./links";
import { createResponseLike } from "./response-conversion";
import { parseCsv, parseTsv } from "./tabular-data";
import { readResponseBody, withStructuredTextAsync, withStructuredTextSet } from "./text";
import { cleanHalResponse, extractHalLinks, withHal } from "./hal";
import { followJSONLink } from "./json";

const schemaLinkProperties = { rel: "described-by", type: "application/schema+json" };
const uischemaLinkProperties = { rel: "stylesheet", type: "application/prs.json-forms-ui-schema+json" };

export const responsePipeline = (response: Response) => resolve(response)
  .then(createResponseLike)
  .then(replaceHeaders)
  .then(withHeaderSet("link", "links", extractLinksFromHeader))
  .then(withHeaderAsync("content-type", (response, header) => resolve(response)
    .then(setProperty("contentType", createMediaType(header)))
    .then(readResponseBody)
    .then(withStructuredTextSet("text", "tab-separated-values", "tsv", parseTsv))
    .then(withStructuredTextSet("text", "csv", "csv", parseCsv))
    .then(withStructuredTextAsync("application", "json", (response, text) => resolve(response)
      .then(addData("json", JSON.parse(text) as unknown))
      .then(takeLinkFromProperty("$schema", schemaLinkProperties))
      .then(takeLinkFromProperty("$uischema", uischemaLinkProperties))
      .then(withContentTypeAsync("application", "hal", "json", response => resolve(response)
        .then(cleanHalResponse)
        .then(withHal(extractHalLinks)))))
    ))
  )
  .then(withFirstLinkSetAsync(schemaLinkProperties, "schema", followJSONLink))
  .then(withFirstLinkSetAsync(uischemaLinkProperties, "uischema", followJSONLink));

export type ProcessedResponse = Awaited<ReturnType<typeof responsePipeline>>;
