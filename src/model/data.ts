import { compose, copyProperty, setProperty } from "../utils/functions";
import { removeDuplicateLinks, type Link, type LinkParameters, type WithLinks } from "./links";

export type WithData<T> = {
  data: Exclude<T, undefined>,
}

export type WithoutData = {
  data: undefined,
}

function hasProperty(obj: object, key: PropertyKey): obj is Record<string, unknown> {
  return key in obj;
}

export function addData<T, V, K extends PropertyKey>(copyKey: K, data: Exclude<V, undefined>): (obj: T) => T & WithData<V> & { [key in K]: V } {
  return compose(setProperty("data", data), copyProperty("data", copyKey));
}

export function createLinkFromProperty(obj: unknown, key: string, parameters: LinkParameters): Link | null {
  if (typeof obj === "object" && obj !== null && hasProperty(obj, key)) {
    const value = obj[key];
    if (typeof value === "string") {
      return {
        url: value,
        parameters,
      };
    }
  }
  return null;
}

export function addLinkFromProperty<V, T extends WithData<V> & Partial<WithLinks>>(key: string, parameters: LinkParameters): (obj: T) => T {
  return (obj: T) => {
    const link = createLinkFromProperty(obj.data, key, parameters);
    if (link) {
      const existingLinks = "links" in obj ? obj.links ?? [] : [];
      return { ...obj, links: removeDuplicateLinks([...existingLinks, link]) };
    } else {
      return obj;
    }
  }
}

export function takeLinkFromProperty<V, T extends WithData<V> & Partial<WithLinks>>(key: string, parameters: LinkParameters): (obj: T) => Omit<T, "data"> & { data: Omit<typeof obj.data, typeof key> } {
  return compose(addLinkFromProperty(key, parameters), removeDataProperty(key));
}

export function removeDataProperty<V, T extends WithData<V>, K extends PropertyKey>(propertyKey: K): (obj: T) => Omit<T, "data"> & { data: Omit<typeof obj.data, K> } {
  return (obj: T) => {
    if (typeof obj.data === "object" && obj.data !== null && hasProperty(obj.data, propertyKey)) {
      const { [propertyKey]: _, ...restData } = obj.data;
      return {
        ...obj,
        data: restData
      };
    } else {
      return obj as Omit<T, "data"> & { data: Omit<typeof obj.data, K> };
    }
  }
}