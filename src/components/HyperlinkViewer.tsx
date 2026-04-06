import { Stack, type StackProps } from "@mui/material";
import { type Link } from "../lib/parse-link-header";
import { Hyperlink } from "./Hyperlink";

export type HyperlinkViewerProps = StackProps & {
  links: Link[],
  onLinkClick?: (link: Link) => void,
}

export const HyperlinkViewer: React.FC<HyperlinkViewerProps> = ({
  links,
  onLinkClick,
  gap = 1,
  direction = "row",
  flexWrap = "wrap",
  width = "100%",
  ...props
}) => {
  return (
    <Stack {...props} gap={gap} direction={direction} flexWrap={flexWrap} width={width}>
      {links.map((link, index) => (
        <Hyperlink key={`link-${index}-${link.url}`} link={link} onLinkClick={() => onLinkClick?.(link)} />
      ))}
    </Stack>
  )
}