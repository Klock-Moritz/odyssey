export type ResponseLike = {
  body: typeof Response.prototype.body,
  bodyUsed: typeof Response.prototype.bodyUsed,
  headers: typeof Response.prototype.headers,
  ok: typeof Response.prototype.ok,
  redirected: typeof Response.prototype.redirected,
  status: typeof Response.prototype.status,
  statusText: typeof Response.prototype.statusText,
  type: typeof Response.prototype.type,
  url: typeof Response.prototype.url,
}

export function createResponseLike(response: Response): ResponseLike {
  return {
    body: response.body,
    bodyUsed: response.bodyUsed,
    headers: response.headers,
    ok: response.ok,
    redirected: response.redirected,
    status: response.status,
    statusText: response.statusText,
    type: response.type,
    url: response.url,
  }
}