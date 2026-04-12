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
  const childrenArray = Array.isArray(children) ? children : [children];
  const [value, setValue] = React.useState(childrenArray[0].props.value ?? 0);

  return (
    <Stack gap={2}>
      <Tabs {...props} value={value} onChange={(_event, value) => setValue(value)}>
        {children}
      </Tabs>
      <Box>
        {childrenArray.map((child, index) => {
          if ((child.props.value ?? index) === value) {
            return child.props.children;
          }
          return null;
        })}
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