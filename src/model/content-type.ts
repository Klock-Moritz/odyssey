import { MediaType } from "../utils/media-type"
import type { WithHeaders } from "./headers";

export type WithContentType = {
  contentType: MediaType | null,
}

export function extractContentType<T extends WithHeaders>(obj: T): T & WithContentType {
  const contentTypeHeader = "content-type" in obj.headers ? obj.headers["content-type"] : undefined;
  return {
    ...obj,
    contentType: contentTypeHeader ? new MediaType(contentTypeHeader) : null,
  }
}