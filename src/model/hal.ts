import utpl from "uri-templates";
import { applyToProperty, compose, condition, copyProperty } from "../utils/functions";
import { isHalResource, normalizeHalLinks, type HalLink, type HalLinks, type HalResource } from "../utils/hal";
import type { WithData } from "./data";
import type { WithJSON } from "./json";
import { removeDuplicateLinks, type Link, type WithLinks } from "./links";

export type WithHal = {
  hal: HalResource
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
  return obj.hal._links ? {
    ...obj,
    links: removeDuplicateLinks([...(obj.links ?? []), ...convertHalLinks(obj.hal._links)]),
  } : obj;
}

export function toHalResource<T extends { json: HalResource }>(obj: T): T & WithHal {
  return copyProperty<"json", "hal", HalResource, T>("json", "hal")(obj);
}

export function withHal<T extends WithJSON, U>(fn: (obj: T & WithHal) => U): (obj: T) => T | U {
  return condition(obj => isHalResource(obj.json),
    compose(toHalResource as (obj: T) => T & WithHal, fn));
}

export function getHalLinks(resource: HalResource, rel: string): HalLink | HalLink[] | undefined {
  return resource._links?.[rel];
}

export function expandLinkTemplate(link: HalLink, resource: HalResource): HalLink {
  return link.templated ? { ...link, href: utpl(link.href).fill(resource), templated: false } : link;
}

export function expandLinkTemplates(links: HalLink | HalLink[], resource: HalResource): HalLink | HalLink[] {
  return Array.isArray(links) ? links.map(link => expandLinkTemplate(link, resource)) : expandLinkTemplate(links, resource);
}

export function setImplicitSelfLinks(hal: HalResource, links: HalLink | HalLink[] | undefined) {
  return (getHalLinks(hal, "self") || links === undefined) ? hal : {
    ...hal,
    _links: {
      ...hal._links,
      self: expandLinkTemplates(links, hal),
    }
  };
}

export function addImplicitSelfLinks(hal: HalResource): HalResource {
  if (hal._embedded) {
    const embedded: { [key: string]: HalResource | HalResource[] } = {};
    for (const [rel, value] of Object.entries(hal._embedded)) {
      if (Array.isArray(value)) {
        embedded[rel] = value.map(item => addImplicitSelfLinks(setImplicitSelfLinks(item, hal._links?.[rel])));
      } else {
        embedded[rel] = addImplicitSelfLinks(setImplicitSelfLinks(value, hal._links?.[rel]));
      }
    }
    return {
      ...hal,
      _embedded: embedded
    };
  } else {
    return hal;
  }
}

export function addImplicitSelfLinksToResponse<T extends WithHal>(obj: T): T {
  return applyToProperty<"hal", HalResource, T, HalResource>("hal", addImplicitSelfLinks)(obj);
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
  return applyToProperty<"data", unknown, T, unknown>("data", cleanHalData)(obj);
}