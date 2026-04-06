import { Box, Stack, Tab, Tabs, type TabProps, type TabsProps } from "@mui/material";
import React from "react";

export type TabGroupProps = Omit<TabsProps, "children"> & {
  children: React.ReactElement<TabGroupEntryProps>[] | React.ReactElement<TabGroupEntryProps>
}

export type TabGroupEntryProps = Omit<TabProps, "children"> & {
  children?: React.ReactNode
}

export const TabGroup: React.FC<TabGroupProps> = ({
  children,
  ...props
}) => {
  const [value, setValue] = React.useState(0);
  const childrenArray = Array.isArray(children) ? children: [children];

  return (
    <Stack gap={2}>
      <Tabs {...props} value={value} onChange={(_event, value) => setValue(value)}>
        {children}
      </Tabs>
      <Box>
        {value < childrenArray.length && childrenArray[value].props.children}
      </Box>
    </Stack>
  )
}

export const TabGroupEntry: React.FC<TabGroupEntryProps> = ({
  children,
  ...props
}) => {
  return <Tab {...props} />
}