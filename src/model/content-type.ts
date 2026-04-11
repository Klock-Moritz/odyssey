import { MediaType } from "../utils/media-type"

export type WithContentType = {
  contentType: MediaType,
}

export function createMediaType(contentTypeHeader: string): MediaType {
  return new MediaType(contentTypeHeader);
}