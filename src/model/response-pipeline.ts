import { setProperty } from "../utils/functions";
import { createMediaType } from "./content-type";
import { replaceHeaders, withHeaderAsync, withHeaderSet } from "./headers";
import { extractLinksFromHeader } from "./links";
import { createResponseLike } from "./response-conversion";
import { parseCsv, parseTsv } from "./tabular-data";
import { readResponseBody, withStructuredTextSet } from "./text";

export const responsePipeline = (response: Response) => Promise.resolve(response)
  .then(createResponseLike)
  .then(replaceHeaders)
  .then(withHeaderSet("link", "links", extractLinksFromHeader))
  .then(withHeaderAsync("content-type", async (response, header) => Promise.resolve(response)
    .then(setProperty("contentType", createMediaType(header)))
    .then(readResponseBody)
    .then(withStructuredTextSet("text", "tab-separated-values", "tsv", parseTsv))
    .then(withStructuredTextSet("text", "csv", "csv", parseCsv)))
  );

export type ProcessedResponse = Awaited<ReturnType<typeof responsePipeline>>;

const test = await responsePipeline(new Response("Hello World"));

if ("links" in test) {
  test.links.forEach(link => console.log(link.url));
}


if ("contentType" in test) {
  console.log(test.contentType.structuredSyntaxSuffix);
}

if ("tsv" in test) {
  console.log(test.tsv.hasHeader);
}