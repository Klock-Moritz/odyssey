import { followLink, type Link } from "./links";

export type WithJSON = {
  json: unknown,
}

export function followJSONLink(link: Link): Promise<any | null> {
  return followLink(link).then(response => response?.json() ?? null);
}