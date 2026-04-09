import { startPipeline } from "../utils/pipeline";
import { extractContentType } from "./content-type";
import { replaceHeaders } from "./headers";
import { extractLinksFromHeader } from "./links";
import { createResponseLike } from "./response-conversion";
import { readResponseBody } from "./text";

export const responsePipeline = startPipeline<Response>()
  .next(createResponseLike)
  .next(replaceHeaders)
  .next(extractLinksFromHeader)
  .next(extractContentType)
  .nextAsync(readResponseBody);

export type ProcessedResponse = Awaited<ReturnType<typeof responsePipeline.apply>>;
