/*
 * Changed version of https://github.com/thlorenz/parse-link-header.
 * Note that this is not compatible with the original version,
 * as it does no longer parse parameters from the url query string.
 * Original license:
 * 
 * Copyright 2013 Thorsten Lorenz. 
 * All rights reserved.
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
export type Link = {
  url: string,
  rel: string,
  [key: string]: string,
}

function createObjects(acc: { [key: string]: string }, p: string) {
  // rel="next" => 1: rel 2: next
  var m = p.match(/\s*(.+)\s*=\s*"?([^"]+)"?/)
  if (m) acc[m[1]] = m[2];
  return acc;
}

function parseLink(link: string): Link | null {
  try {
    const match = link.match(/<?([^>]*)>(.*)/);
    const linkUrl = match?.[1];
    const parts = match?.[2].split(';');

    if (!linkUrl || !parts) {
      return null;
    }

    parts.shift();
    var info = {
      ...parts.reduce(createObjects, {}),
      url: linkUrl,
    };

    return "rel" in info ? info as Link : null;
  } catch (e) {
    return null;
  }
}

export default function parseLinks(linkHeader: string): Link[] {
  return linkHeader.split(/,\s*</)
    .map(parseLink)
    .filter(link => link !== null)
};