import { Chip, type ChipProps } from "@mui/material";

export type LabeledValueChipProps = ChipProps & {
  value: React.ReactNode,
}

export const LabeledValueChip: React.FC<LabeledValueChipProps> = ({
  label,
  value,
  ...props
}) => {
  return (
    <Chip {...props} avatar={<Chip size="small" label={label} />}
      label={value} sx={{
        '& .MuiChip-avatar': {
          width: "fit-content"
        }
      }} />
  )
}