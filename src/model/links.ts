import parseLinkHeader from "../utils/parse-link-header";
import type { WithHeaders } from "./headers";

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
  [key: string]: string | undefined,
}

export type Link = {
  url: string,
  parameters: LinkParameters,
}

function createLinkDeduplicationKey(link: Link): string {
  const sortedParameters = Object.entries(link.parameters)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));

  return JSON.stringify({
    url: link.url,
    parameters: sortedParameters,
  });
}

function removeDuplicateLinks(links: Link[]): Link[] {
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

export function addLinks<T extends Partial<WithLinks>>
  (obj: T, ...links: Link[]): T & WithLinks {

  return {
    ...obj,
    links: removeDuplicateLinks(obj.links?.concat(links) || links),
  };
}

export function extractLinksFromHeader<T extends Partial<WithLinks>
  & WithHeaders>(response: T): T & WithLinks {

  const linkHeader = "link" in response.headers ? response.headers.link : undefined;
  if (linkHeader) {
    try {
      return addLinks(response, ...parseLinkHeader(linkHeader).map(({ url, ...parameters }) => ({
        url,
        parameters: parameters,
      })));
    } catch (error) {
      console.warn("Failed to parse Link header:", error);
    }
  }
  return { ...response, links: response.links || [] };
}