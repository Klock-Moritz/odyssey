export type HalCurie = {
  name: string,
  href: string,
  templated: true,
}

export type HalLink = {
  href: string,
  templated?: boolean,
  type?: string,
  deprecation?: string,
  name?: string,
  profile?: string,
  title?: string,
  hreflang?: string,
}

export type HalLinksWithCuries = {
  curies: HalCurie[],
  [rel: string]: HalLink | HalLink[],
}

export type HalLinks = {
  [rel: string]: HalLink | HalLink[],
}

export type HalResource = {
  _links?: HalLinks | HalLinksWithCuries,
  _embedded?: Record<string, HalResource | HalResource[]>,
  [key: string]: any,
}

export function isHalCurie(object: any): object is HalCurie {
  return typeof object === "object"
    && object !== null
    && typeof object.name === "string"
    && typeof object.href === "string"
    && object.templated === true;
}

export function isHalLink(object: any): object is HalLink {
  return typeof object === "object"
    && object !== null
    && typeof object.href === "string"
    && (object.templated === undefined || typeof object.templated === "boolean")
    && (object.type === undefined || typeof object.type === "string")
    && (object.deprecation === undefined || typeof object.deprecation === "string")
    && (object.name === undefined || typeof object.name === "string")
    && (object.profile === undefined || typeof object.profile === "string")
    && (object.title === undefined || typeof object.title === "string")
    && (object.hreflang === undefined || typeof object.hreflang === "string");
}

export function isHalLinks(object: any): object is HalLinks | HalLinksWithCuries {
  return typeof object === "object"
    && object !== null
    && Object.entries(object).every(([rel, link]) => {
      if (rel === "curies") {
        return Array.isArray(link) && link.every(isHalCurie);
      } else {
        return isHalLink(link) || (Array.isArray(link) && link.every(isHalLink));
      }
    });
}

export function isHalLinksWithCuries(object: any): object is HalLinksWithCuries {
  return isHalLinks(object) && "curies" in object;
}

export function isHalResource(object: any): object is HalResource {
  return typeof object === "object"
    && object !== null
    && (object._links === undefined || isHalLinks(object._links))
    && (object._embedded === undefined ||
      (typeof object._embedded === "object" && Object.values(object._embedded)
        .every(resource => isHalResource(resource) || (Array.isArray(resource) && resource.every(isHalResource)))));
}

export type NormalizedHalLinks = {
  [rel: string]: HalLink[],
}

export function normalizeHalLinks(links: HalLinks | HalLinksWithCuries): NormalizedHalLinks {
  const normalized: NormalizedHalLinks = {};
  Object.entries(links).forEach(([rel, link]) => {
    if (rel !== "curies") {
      normalized[rel] = Array.isArray(link) ? link : [link];
    }
  });
  return normalized;
}