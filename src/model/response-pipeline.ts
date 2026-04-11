import { createMediaType } from "./content-type";
import { replaceHeaders, withHeaderSet } from "./headers";
import { extractLinksFromHeader } from "./links";
import { createResponseLike } from "./response-conversion";
import { readResponseBody } from "./text";

export const responsePipeline = (response: Response) => Promise.resolve(response)
  .then(createResponseLike)
  .then(replaceHeaders)
  .then(withHeaderSet("link", "links", extractLinksFromHeader))
  .then(withHeaderSet("content-type", "contentType", createMediaType))
  .then(readResponseBody);

export type ProcessedResponse = Awaited<ReturnType<typeof responsePipeline>>;
