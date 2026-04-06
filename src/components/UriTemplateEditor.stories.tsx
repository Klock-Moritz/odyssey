import type { Meta, StoryObj } from '@storybook/react-vite';

import { UriTemplateEditor } from './UriTemplateEditor';
import { fn } from 'storybook/test';
import React from 'react';
import { Typography } from '@mui/material';

const meta = {
  component: UriTemplateEditor,
  args: {
    onUpdateUri: fn(),
  },
  decorators: [
    (Story, context) => {
      const [uri, setUri] = React.useState<string>();
      return (
        <div style={{ maxWidth: "600px" }}>
          <Story args={{
            ...context.args,
            onUpdateUri: uri => {
              setUri(uri);
              context.args.onUpdateUri?.(uri);
            }
          }} />
          <Typography fontStyle="italic">(Current URI: {uri})</Typography>
        </div>
      );
    }
  ]
} satisfies Meta<typeof UriTemplateEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    template: "https://example.com/api/{version}/items{?page,size,sort}",
  },
};