import type { WithHeaders } from "./headers";
import type { ResponseLike } from "./response-conversion";

export type WithBody = {
  body: typeof Response.prototype.body,
}

export type WithText = {
  text: string | null,
}

export type TextResponse = ResponseLike & WithText;

export async function readResponseBody<T extends WithBody & Partial<WithHeaders>>(response: T): Promise<T & WithText> {
  if (response.body === null) {
    return {
      ...response,
      text: null,
    };
  }

  return {
    ...response,
    text: await new Response(response.body, { headers: response.headers }).text(),
  };
}