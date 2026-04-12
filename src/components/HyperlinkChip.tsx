import { Tooltip } from '@mui/material';
import { type LinkParameters, type Link as LinkType } from '../model/links';
import { LabeledValueChip, type LabeledValueChipProps } from './LabeledValueChip';
import { Hyperlink } from './Hyperlink';

export type HyperlinkChipProps = Omit<LabeledValueChipProps, 'label' | 'value'> & {
  link: LinkType,
  onLinkClick?: (link: LinkType) => void,
}

export const HyperlinkChip: React.FC<HyperlinkChipProps> = ({
  link,
  onLinkClick,
  ...props
}) => {
  let additionalInfo: Partial<LinkParameters> = { ...link.parameters };
  delete additionalInfo.rel;
  if ("title" in link.parameters) {
    delete additionalInfo.title;
    additionalInfo.href = link.url;
  }
  delete additionalInfo.templated;
  delete additionalInfo.deprecation;

  const { templated: _, ...rest } = link.parameters;

  return (
    <Tooltip title={Object.keys(additionalInfo).length > 0
      ? Object.entries(additionalInfo).filter(([_key, value]) => !!value).map(([key, value]) => (
        <div>{`${key}: ${value}`}</div>
      )) : undefined}>
      <LabeledValueChip {...props} label={link.parameters.rel} value={
        <Hyperlink href={link.url} parameters={link.parameters} target="_blank" rel="noopener noreferrer" hideUrl
          onLinkClick={href => onLinkClick?.({ url: href, parameters: rest })} />
      } />
    </Tooltip>
  )
}