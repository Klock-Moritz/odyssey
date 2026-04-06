import type React from "react"
import { TableViewer } from "./TableViewer"
import Papa, { type ParseConfig } from "papaparse"

export type CsvViewerProps = ParseConfig & {
  text: string,
}

export const CsvViewer: React.FC<CsvViewerProps> = ({
  text,
  skipEmptyLines = true,
  ...config
}) => {
  const parseResult = Papa.parse(text, {
    ...config,
    skipEmptyLines,
  });
  const data = parseResult.data;

  if (data.length === 0) {
    return "No rows";
  } else {
    return <TableViewer fields={Object.keys(data[0])} rows={data} />
  }
}