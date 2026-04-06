import type { Meta, StoryObj } from '@storybook/react-vite';

import { HeaderEditDialog } from './HeaderEditDialog';
import { fn } from 'storybook/test';
import { Button } from '@mui/material';
import React from 'react';

const meta = {
  component: HeaderEditDialog,
  args: {
    onSubmitted: fn(),
  },
  render: (props) => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Open Dialog
        </Button>
        <HeaderEditDialog {...props} open={open} onClose={() => setOpen(false)} />
      </>
    )
  }
} satisfies Meta<typeof HeaderEditDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: false
  }
};

export const EditExistingHeader: Story = {
  args: {
    open: false,
    headerName: "accept",
    defaultValue: "application/hal+json, application/json;q=0.9, */*;q=0.8"
  }
};