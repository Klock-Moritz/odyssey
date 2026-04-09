export type WithHeadersClass = {
  headers: Headers,
}

export type WithHeaders = {
  headers: { [key: string]: string },
}

export function replaceHeaders<T extends WithHeadersClass>(obj: T): Omit<T, "headers"> & WithHeaders {
  const headersObj: { [key: string]: string } = {};
  for (const [key, value] of obj.headers.entries()) {
    headersObj[key] = value;
  }
  return {
    ...obj,
    headers: headersObj,
  };
}