import { choose, condition, resolve } from "../utils/functions";
import { getMediaTypePredicate, getStructuredMediaTypePredicate, MediaType } from "../utils/media-type"

export type WithContentType = {
  contentType: MediaType,
}

export function createMediaType(contentTypeHeader: string): MediaType {
  return new MediaType(contentTypeHeader);
}

export function hasStructure<T extends WithContentType>(type: string, suffix: string): (obj: T) => boolean {
  return (obj: T) => getStructuredMediaTypePredicate(type, suffix)(obj.contentType);
}

export function hasContentType<T extends WithContentType>(type: string, innerSubtype: string, suffix: string | null): (obj: T) => boolean {
  return (obj: T) => getMediaTypePredicate(type, innerSubtype, suffix)(obj.contentType);
}

export function withContentType<T extends WithContentType, U>(type: string, innerSubtype: string, suffix: string | null, fn: (obj: T, contentType: MediaType) => U): (obj: T) => T | U {
  return condition(hasContentType(type, innerSubtype, suffix), (obj: T) => fn(obj, obj.contentType));
}

export function withContentTypeAsync<T extends WithContentType, U>(type: string, innerSubtype: string, suffix: string | null, fn: (obj: T, contentType: MediaType) => Promise<U>): (obj: T) => Promise<T | U> {
  return choose(hasContentType(type, innerSubtype, suffix), (obj: T) => fn(obj, obj.contentType), resolve);
}