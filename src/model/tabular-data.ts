import Papa from "papaparse";
import type { MediaType } from "../utils/media-type";

export type TabularData<K extends PropertyKey, V> = {
  hasHeader: boolean,
  header: K[],
  records: Record<K, V>[],
}

export type WithTabularData<K extends PropertyKey, V> = {
  table: TabularData<K, V>,
}

export function parseDelimitedText(text: string, delimiter: string, hasHeader: true): TabularData<string, string>;
export function parseDelimitedText(text: string, delimiter: string, hasHeader: false): TabularData<number, string>;
export function parseDelimitedText(text: string, delimiter: string, hasHeader: boolean): TabularData<string, string> | TabularData<number, string> {
  if (hasHeader) {
    const parseResult = Papa.parse<Record<string, string>>(text, {
      delimiter,
      skipEmptyLines: true,
      header: true,
    });

    return {
      hasHeader: true,
      header: parseResult.meta.fields ?? [],
      records: parseResult.data,
    };
  } else {
    const parseResult = Papa.parse<string[]>(text, {
      delimiter,
      skipEmptyLines: true,
      header: false,
    });

    return {
      hasHeader: false,
      header: parseResult.data.length > 0 ? parseResult.data[0].map((_, index) => index) : [],
      records: parseResult.data,
    };
  }
}

export function hasHeader(contentType: MediaType): boolean {
  return contentType.parameters.get("header") === "present";
}

export function parseCsv(text: string, contentType: MediaType): TabularData<string, string> | TabularData<number, string> {
  return hasHeader(contentType) ? parseDelimitedText(text, ',', true) : parseDelimitedText(text, ',', false);
}

export function parseTsv(text: string): TabularData<string, string> {
  return parseDelimitedText(text, '\t', true);
}