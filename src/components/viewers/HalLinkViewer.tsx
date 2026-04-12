import { type HalLink as HalLinkType, type HalLinks, normalizeHalLinks } from "../../utils/hal";
import { DataGrid, type DataGridProps } from "@mui/x-data-grid";
import { Hyperlink } from "../Hyperlink";
import { Link } from "@mui/material";
import { convertHalLink } from "../../model/hal";

export type HalLinkViewerProps = Omit<DataGridProps, 'columns' | 'rows'> & {
  links: HalLinks,
  onLinkClick?: (href: string, rel: string, link: HalLinkType) => void,
}

export const HalLinkViewer: React.FC<HalLinkViewerProps> = ({
  links,
  rowSelection = false,
  ...props
}) => {
  return (
    <DataGrid {...props} rowSelection={rowSelection} columns={[
      { field: "rel", headerName: "Relation" },
      {
        field: "href", headerName: "URL",
        valueGetter: (value, row) => row.title ?? value,
        renderCell: params => {
          const link = convertHalLink(params.row.rel, params.row);
          return <Hyperlink href={link.url} parameters={link.parameters} onLinkClick={(href) => props.onLinkClick?.(href, params.row.rel, params.row)} />
        },
        width: 300,
      },
      { field: "name", headerName: "Name" },
      { field: "type", headerName: "Media Type", width: 150 },
      { field: "hreflang", headerName: "Language" },
      {
        field: "profile", headerName: "Profile", width: 300, renderCell: params => (
          <Link href={params.value} target="_blank" rel="noopener noreferrer">
            {params.value}
          </Link>
        )
      },
    ]} rows={Object.entries(normalizeHalLinks(links))
      .flatMap(([rel, links]) => links.map((link, index) => ({
        id: `${rel}-${index}`,
        rel,
        ...link,
      })))} />
  )
}