import type { Meta, StoryObj } from '@storybook/react-vite';

import { TabGroup, TabGroupEntry } from './TabGroup';
import { Typography } from '@mui/material';

const meta = {
  component: TabGroup,
} satisfies Meta<typeof TabGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: [
      <TabGroupEntry label="First"><Typography>First content</Typography></TabGroupEntry>,
      <TabGroupEntry label="Second"><Typography>Second content</Typography></TabGroupEntry>,
      <TabGroupEntry label="Third"><Typography>Third content</Typography></TabGroupEntry>,
    ]
  },
};