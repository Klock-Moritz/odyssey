import { DataGrid, type DataGridProps } from "@mui/x-data-grid";
import type { HalResource, HalLink as HalLinkType } from "../../utils/hal";
import utpl from "uri-templates";
import { Hyperlink } from "../Hyperlink";
import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { convertHalLink } from "../../model/hal";

export type HalEmbeddedViewerProps = Omit<DataGridProps, 'columns' | 'rows'> & {
  resource: HalResource,
  childViewerCreator: (child: HalResource) => Promise<React.ReactNode>,
  onLinkClick?: (href: string, rel: string, link: HalLinkType) => void,
}

export const HalEmbeddedViewer: React.FC<HalEmbeddedViewerProps> = ({
  resource,
  childViewerCreator,
  rowSelection = false,
  onLinkClick,
  ...props
}) => {
  const [selectedChild, setSelectedChild] = React.useState<HalResource>();
  const [childViewer, setChildViewer] = React.useState<React.ReactNode>();

  React.useEffect(() => {
    if (selectedChild) {
      childViewerCreator(selectedChild).then(setChildViewer);
    } else {
      setChildViewer(undefined);
    }
  }, [selectedChild]);


  return resource._embedded ? (
    <>
      <DataGrid {...props} rowSelection={rowSelection} columns={[
        { field: "rel", headerName: "Relation" },
        { field: "name", headerName: "Name", valueGetter: (_value, row) => row.link?.name },
        {
          field: "link", headerName: "Link", valueGetter: (_value, row) => row.link?.href,
          renderCell: params => {
            if (params.row.link) {
              const link = convertHalLink(params.row.rel, params.row.link);
              return (
                <Hyperlink href={link.url} parameters={link.parameters} target="_blank" rel="noopener noreferrer"
                  onLinkClick={href => onLinkClick?.(href, params.row.rel, params.row.link)} />
              )
            }
          },
          width: 300,
        },
      ]} rows={Object.entries(resource._embedded)
        .map(([rel, child]) => [rel, Array.isArray(child) ? child : [child]] as [string, HalResource[]])
        .flatMap(([rel, children]) => children.map((child, index) => ({
          id: `${rel}-${index}`,
          ...getChildRow(resource, child, rel)
        })))} onRowClick={(params, event) => {
          const target = event.target;
          if (target && "href" in target) {
            return;
          }
          setSelectedChild(params.row.child);
        }} sx={{
          '& .MuiDataGrid-row': {
            cursor: "pointer",
          }
        }} />
      {selectedChild && (
        <Dialog open>
          <DialogTitle minWidth={500}>Embedded Resource</DialogTitle>
          <DialogContent>
            {childViewer}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedChild(undefined)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  ) : undefined;
}

function getChildRow(resource: HalResource, child: HalResource, rel: string) {
  let link = child._links?.self;
  if (!link && resource._links && rel in resource._links) {
    link = resource._links[rel];
  }
  if (Array.isArray(link)) {
    link = link[0];
  }
  if (link && link.templated) {
    link = {
      ...link,
      href: utpl(link.href).fill(child),
      templated: false,
    };
  }

  return {
    rel,
    child,
    link,
  }
}