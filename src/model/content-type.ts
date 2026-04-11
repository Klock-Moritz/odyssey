import { getStructuredMediaTypePredicate, MediaType } from "../utils/media-type"

export type WithContentType = {
  contentType: MediaType,
}

export function createMediaType(contentTypeHeader: string): MediaType {
  return new MediaType(contentTypeHeader);
}

export function hasStructure<T extends WithContentType>(type: string, suffix: string): (obj: T) => boolean {
  return (obj: T) => getStructuredMediaTypePredicate(type, suffix)(obj.contentType);
}