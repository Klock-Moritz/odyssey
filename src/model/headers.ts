import { choose, condition, resolve, setProperty } from "../utils/functions";

export type WithHeadersClass = {
  headers: Headers,
}

export type WithHeaders = {
  headers: Record<string, string>,
}

export function replaceHeaders<T extends WithHeadersClass>(obj: T): Omit<T, "headers"> & WithHeaders {
  return setProperty<T, "headers", Record<string, string>>("headers", Object.fromEntries(obj.headers))(obj);
}

export function hasHeader<T extends WithHeaders>(key: string): (obj: T) => boolean {
  return (obj: T) => key in obj.headers;
}

export function withHeader<T extends WithHeaders, U>(key: string, fn: (obj: T, value: string) => U): (obj: T) => T | U {
  return condition(hasHeader(key), (obj: T) => fn(obj, obj.headers[key]));
}

export function withHeaderAsync<T extends WithHeaders, U>(key: string, fn: (obj: T, value: string) => Promise<U>): (obj: T) => Promise<T | U> {
  return choose(hasHeader(key), (obj: T) => fn(obj, obj.headers[key]), resolve);
}

export function withHeaderSet<T extends WithHeaders, K extends PropertyKey, V>(key: string, propertyKey: K, valueFn: (value: string) => V): (obj: T) => T | (T & { [key in K]: V }) {
  return condition(hasHeader(key), (obj: T) => setProperty<T, K, V>(propertyKey, valueFn(obj.headers[key]))(obj));
}