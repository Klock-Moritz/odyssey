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

export function extractLinksFromHeader(linkHeader: string): Link[] {
  return removeDuplicateLinks(parseLinkHeader(linkHeader)
    .map(({ url, ...parameters }) => ({
      url,
      parameters: parameters,
    })));
}