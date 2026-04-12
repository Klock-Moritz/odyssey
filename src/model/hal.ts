import { compose, condition, setProperty } from "../utils/functions";
import { isHalResource, normalizeHalLinks, type HalLink, type HalLinks, type HalResource } from "../utils/hal";
import type { WithData } from "./data";
import type { WithJSON } from "./json";
import { removeDuplicateLinks, type Link, type WithLinks } from "./links";

export type WithHal = {
  isHalResource: true,
  json: HalResource
}

export function convertHalLink(rel: string, link: HalLink): Link {
  const { href, ...parameters } = link;
  return { url: href, parameters: { ...parameters, rel } };
}

export function convertHalLinks(links: HalLinks): Link[] {
  return Object.entries(normalizeHalLinks(links)).flatMap(([rel, links]) =>
    links.map((link) => convertHalLink(rel, link))
  );
}

export function extractHalLinks<T extends WithHal & Partial<WithLinks>>(obj: T) {
  return obj.json._links ? {
    ...obj,
    links: removeDuplicateLinks([...(obj.links ?? []), ...convertHalLinks(obj.json._links)]),
  } : obj;
}

export function toHalResource<T extends { json: HalResource }>(obj: T): T & WithHal {
  return setProperty<T & { json: HalResource }, "isHalResource", true>("isHalResource", true)(obj);
}

export function withHal<T extends WithJSON, U>(fn: (obj: T & WithHal) => U): (obj: T) => T | U {
  return condition(obj => isHalResource(obj.json),
    compose(toHalResource as (obj: T) => T & WithHal, fn));
}

export function cleanHalData(data: unknown) {
  if (typeof data === "object" && data !== null) {
    let rest = data;
    if ("_links" in rest) {
      const { _links, ...restWithoutLinks } = rest;
      rest = restWithoutLinks;
    }
    if ("_embedded" in rest && typeof rest._embedded === "object" && rest._embedded !== null) {
      const { _embedded, ...restWithoutEmbedded } = rest;
      rest = {
        ...restWithoutEmbedded, _embedded: Object.entries(_embedded).reduce((acc, [key, value]) => {
          if (Array.isArray(value)) {
            acc[key] = value.map(cleanHalData);
          } else {
            acc[key] = cleanHalData(value);
          }
          return acc;
        }, {} as { [key: string]: unknown })
      };
    }
    return rest;
  } else {
    return data;
  }
}

export function cleanHalResponse<T extends WithData<unknown>>(obj: T): Omit<T, "data"> & { data: unknown } {
  return setProperty<T, "data", unknown>("data", cleanHalData(obj.data))(obj);
}