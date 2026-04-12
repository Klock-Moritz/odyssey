import { DataGrid } from "@mui/x-data-grid"
import type React from "react"
import _ from "lodash"
import type { TabularData } from "../../model/tabular-data"

export type TableViewerProps = {
  data: TabularData<any, any>,
}

export const TableViewer: React.FC<TableViewerProps> = ({
  data
}) => {
  return (
    <DataGrid rows={data.records.map((row, index) => {
      return "id" in row ? row : { id: index, ...row }
    })} columns={data.header.map(field => ({
      field: field,
      headerName: _.startCase(field),
    }))} disableRowSelectionOnClick />
  )
}