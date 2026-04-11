import { startPipeline } from "../utils/pipeline";
import { createMediaType } from "./content-type";
import { replaceHeaders, withHeaderSet } from "./headers";
import { extractLinksFromHeader } from "./links";
import { createResponseLike } from "./response-conversion";
import { readResponseBody } from "./text";

export const responsePipeline = startPipeline<Response>()
  .next(createResponseLike)
  .next(replaceHeaders)
  .next(withHeaderSet("link", "links", extractLinksFromHeader))
  .next(withHeaderSet("content-type", "contentType", createMediaType))
  .nextAsync(readResponseBody);

export type ProcessedResponse = Awaited<ReturnType<typeof responsePipeline.apply>>;

const test = await responsePipeline.apply(new Response("Hello World"));
if ("links" in test) {
  test.links.forEach(link => console.log(link.url));
}
if ("contentType" in test) {
  console.log(test.contentType.structuredSyntaxSuffix);
}