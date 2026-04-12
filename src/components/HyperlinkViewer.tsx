import { Stack, type StackProps } from "@mui/material";
import { type Link } from "../model/links";
import { HyperlinkChip } from "./HyperlinkChip";

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
        <HyperlinkChip key={`link-${index}-${link.url}`} link={link} onLinkClick={onLinkClick} />
      ))}
    </Stack>
  )
}