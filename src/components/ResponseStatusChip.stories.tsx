import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResponseStatusChip } from './ResponseStatusChip';
import { Box } from '@mui/material';

const meta = {
  component: ResponseStatusChip,
} satisfies Meta<typeof ResponseStatusChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 200,
    statusText: 'OK',
  },
  render: () => (
    <Box sx={{display: "flex", gap: "8px" }}>
      <ResponseStatusChip status={103} statusText='Early Hints' />
      <ResponseStatusChip status={200} statusText='OK' />
      <ResponseStatusChip status={301} statusText='Moved Permanently' />
      <ResponseStatusChip status={404} statusText='Not Found' />
      <ResponseStatusChip status={500} statusText='Internal Server Error' />
    </Box>
  )
};