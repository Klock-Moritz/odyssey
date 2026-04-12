import { Link, Tooltip } from '@mui/material';
import { type LinkParameters, type Link as LinkType } from '../model/links';
import { LabeledValueChip, type LabeledValueChipProps } from './LabeledValueChip';

export type HyperlinkProps = Omit<LabeledValueChipProps, 'label' | 'value'> & {
  link: LinkType,
  onLinkClick?: () => void,
}

export const Hyperlink: React.FC<HyperlinkProps> = ({
  link,
  onLinkClick,
  ...props
}) => {
  let additionalInfo: Partial<LinkParameters> = { ...link.parameters };
  if ("title" in link.parameters) {
    delete additionalInfo.title;
  } else {
    delete additionalInfo.url;
  }
  delete additionalInfo.rel;

  return (
    <Tooltip title={Object.keys(additionalInfo).length > 0
      ? Object.entries(additionalInfo).filter(([_key, value]) => !!value).map(([key, value]) => (
        <div>{`${key}: ${value}`}</div>
      )) : undefined}>
      <LabeledValueChip {...props} label={link.parameters.rel} value={
        <Link href={link.url} target="_blank" rel="noopener noreferrer"
          onClick={e => {
            if (onLinkClick) {
              e.preventDefault();
              onLinkClick();
            }
          }}
        >
          {"title" in link.parameters ? link.parameters.title : link.url}
        </Link>
      } />
    </Tooltip >
  )
}