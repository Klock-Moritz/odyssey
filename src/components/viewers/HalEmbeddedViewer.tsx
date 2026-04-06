import { DataGrid, type DataGridProps } from "@mui/x-data-grid";
import type { HalResource, HalLink as HalLinkType } from "../../lib/hal";
import utpl from "uri-templates";
import { HalLink } from "../HalLink";
import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { TabGroup, type TabGroupEntryProps } from "../TabGroup";

export type HalEmbeddedViewerProps = Omit<DataGridProps, 'columns' | 'rows'> & {
  resource: HalResource,
  childViewer: (child: HalResource) => Promise<React.ReactElement<TabGroupEntryProps> | React.ReactElement<TabGroupEntryProps>[]>,
  onLinkClick?: (href: string, rel: string, link: HalLinkType) => void,
  onInnerLinkClick?: (url: string, options?: RequestInit) => void,
}

export const HalEmbeddedViewer: React.FC<HalEmbeddedViewerProps> = ({
  resource,
  childViewer,
  rowSelection = false,
  onLinkClick,
  onInnerLinkClick,
  ...props
}) => {
  const [selectedChild, setSelectedChild] = React.useState<HalResource>();
  const [childViewers, setChildViewers] = React.useState<React.ReactElement<TabGroupEntryProps> | React.ReactElement<TabGroupEntryProps>[]>();

  React.useEffect(() => {
    if (selectedChild) {
      childViewer(selectedChild).then(viewers => {
        setChildViewers(viewers);
      });
    } else {
      setChildViewers(undefined);
    }
  }, [selectedChild]);


  return resource._embedded ? (
    <>
      <DataGrid {...props} rowSelection={rowSelection} columns={[
        { field: "rel", headerName: "Relation" },
        { field: "name", headerName: "Name", valueGetter: (_value, row) => row.link?.name },
        {
          field: "link", headerName: "Link", valueGetter: (_value, row) => row.link?.href,
          renderCell: params => params.row.link && (
            <HalLink link={params.row.link} onLinkClick={(href) => onLinkClick?.(href, params.row.rel, params.row.link)} />
          ),
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
            {childViewers && (
              <TabGroup>
                {childViewers}
              </TabGroup>
            )}
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