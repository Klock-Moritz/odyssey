import { choose, condition, resolve, setProperty } from "../utils/functions";
import type { MediaType } from "../utils/media-type";
import { hasStructure, type WithContentType } from "./content-type";
import type { WithHeaders } from "./headers";
import type { ResponseLike } from "./response-conversion";

export type WithBody = {
  body: typeof Response.prototype.body,
}

export type WithText = {
  text: string,
}

export type TextResponse = ResponseLike & WithText;

export async function readResponseBody<T extends WithBody & Partial<WithHeaders>>(response: T): Promise<T & WithText> {
  return {
    ...response,
    text: await new Response(response.body, { headers: response.headers }).text(),
  };
}

export function withTextSet<T extends WithText, K extends PropertyKey, V>(propertyKey: K, valueFn: (text: string) => V): (obj: T) => T & { [key in K]: V } {
  return (obj: T) => setProperty<T, K, V>(propertyKey, valueFn(obj.text))(obj);
}

export function withStructuredText<T extends WithText & WithContentType, U>(type: string, suffix: string, fn: (obj: T, text: string, contentType: MediaType) => U): (obj: T) => T | U {
  return condition(hasStructure(type, suffix), (obj: T) => fn(obj, obj.text, obj.contentType));
}

export function withStructuredTextAsync<T extends WithText & WithContentType, U>(type: string, suffix: string, fn: (obj: T, text: string, contentType: MediaType) => Promise<U>): (obj: T) => Promise<T | U> {
  return choose(hasStructure(type, suffix), (obj: T) => fn(obj, obj.text, obj.contentType), resolve);
}

export function withStructuredTextSet<T extends WithText & WithContentType, K extends PropertyKey, V>(type: string, suffix: string, propertyKey: K, valueFn: (text: string, contentType: MediaType) => V): (obj: T) => T | (T & { [key in K]: V }) {
  return condition(hasStructure(type, suffix), (obj: T) => setProperty<T, K, V>(propertyKey, valueFn(obj.text, obj.contentType))(obj));
}