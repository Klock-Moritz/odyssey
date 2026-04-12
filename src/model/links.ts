import { resolve, setProperty, setPropertyAsync } from "../utils/functions";
import parseLinkHeader from "../utils/parse-link-header";

export type WithLinks = {
  links: Link[],
}

export type LinkParameters = {
  rel: string,
  anchor?: string,
  rev?: string,
  hreflang?: string,
  media?: string,
  title?: string,
  type?: string,
  templated?: boolean,
  [key: string]: string | number | boolean | undefined,
}

export type Link = {
  url: string,
  parameters: LinkParameters,
}

export function isLink<T>(obj: T): obj is T & Link {
  return typeof obj === "object" && obj !== null && "url" in obj && typeof obj.url === "string" && "parameters" in obj && typeof obj.parameters === "object" && obj.parameters !== null && "rel" in obj.parameters && typeof obj.parameters.rel === "string";
}

function createLinkDeduplicationKey(link: Link): string {
  const sortedParameters = Object.entries(link.parameters)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));

  return JSON.stringify({
    url: link.url,
    parameters: sortedParameters,
  });
}

export function removeDuplicateLinks(links: Link[]): Link[] {
  const uniqueLinks: Link[] = [];
  const seen = new Set<string>();

  for (const link of links) {
    const key = createLinkDeduplicationKey(link);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    uniqueLinks.push(link);
  }

  return uniqueLinks;
}

export function extractLinksFromHeader(linkHeader: string): Link[] {
  return removeDuplicateLinks(parseLinkHeader(linkHeader)
    .map(({ url, ...parameters }) => ({
      url,
      parameters: parameters,
    })));
}

export function hasLinks<T>(obj: T): obj is T & WithLinks {
  return typeof obj === "object" && obj !== null && "links" in obj && Array.isArray(obj.links)
    && obj.links.every(isLink);
}

export function withLinks<T, U>(fn: (obj: T, links: Link[]) => U): (obj: T) => U {
  return (obj: T) => hasLinks(obj) ? fn(obj, obj.links) : fn(obj, []);
}

export function withFilteredLinks<T, U>(filter: Partial<LinkParameters>, fn: (obj: T, links: Link[]) => U): (obj: T) => U {
  return withLinks((obj: T, links: Link[]) => {
    const filteredLinks = links.filter(link => Object.entries(filter).every(([key, value]) => link.parameters[key] === value));
    return fn(obj, filteredLinks);
  });
}

export function withFirstLinkSet<T, K extends PropertyKey, V>(filter: Partial<LinkParameters>, propertyKey: K, valueFn: (link: Link) => V): (obj: T) => T | (T & { [key in K]: V }) {
  return withFilteredLinks(filter, (obj: T, links: Link[]) => {
    if (links.length > 0) {
      return setProperty<T, K, V>(propertyKey, valueFn(links[0]))(obj);
    } else {
      return obj;
    }
  })
}

export function withFirstLinkSetAsync<T, K extends PropertyKey, V>(filter: Partial<LinkParameters>, propertyKey: K, valueFn: (link: Link) => Promise<V>): (obj: T) => Promise<T | (T & { [key in K]: V })> {
  return withFilteredLinks(filter, (obj: T, links: Link[]) => {
    if (links.length > 0) {
      return setPropertyAsync<T, K, V>(propertyKey, valueFn(links[0]))(obj);
    } else {
      return resolve(obj);
    }
  })
}

export function followLink(link: Link): Promise<Response | null> {
  return fetch(link.url, {
    headers: {
      "Accept": link.parameters.type ?? "*/*",
      "Accept-Language": link.parameters.hreflang ?? "*",
    },
  }).then(response => response.ok ? response : null, () => null);
}