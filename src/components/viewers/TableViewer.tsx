import { DataGrid } from "@mui/x-data-grid"
import type React from "react"
import _ from "lodash"

export type TableViewerProps = {
  fields: string[],
  rows: Record<string, any>[],
}

export const TableViewer: React.FC<TableViewerProps> = ({
  fields,
  rows,
}) => {
  return (
    <DataGrid rows={rows.map((row, index) => {
      return "id" in row ? row : { id: index, ...row }
    })} columns={fields.map(field => ({
      field: field,
      headerName: _.startCase(field),
    }))} disableRowSelectionOnClick />
  )
}