import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResponseBodyViewer } from './ResponseBodyViewer';
import { TabGroupEntry } from './TabGroup';
import { Typography } from '@mui/material';
import { MediaType } from '../utils/media-type';

const meta = {
  component: ResponseBodyViewer,
} satisfies Meta<typeof ResponseBodyViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    response: {
      headers: {
        'content-type': 'text/plain',
      },
      contentType: new MediaType('text/plain'),
      bodyUsed: false,
      ok: false,
      redirected: false,
      status: 0,
      statusText: '',
      type: 'basic',
      url: '',
      text: 'Hello, world!',
      links: [],
    },
    viewers: [
      {
        predicate: () => true,
        renderer: async (response) => (
          <TabGroupEntry label="Text">
            <Typography>{response.text}</Typography>
          </TabGroupEntry>
        )
      }
    ]
  }
};

export const NoViewer: Story = {
  args: {
    response: {
      headers: {
        "content-type": "application/json"
      },
      contentType: new MediaType("application/json"),
      ok: false,
      redirected: false,
      status: 0,
      statusText: '',
      type: 'basic',
      url: '',
      bodyUsed: false,
      text: null,
      links: [],
    },
    viewers: []
  }
};

export const NoContentType: Story = {
  args: {
    response: {
      headers: {},
      contentType: null,
      ok: false,
      redirected: false,
      status: 0,
      statusText: '',
      type: 'basic',
      url: '',
      bodyUsed: false,
      links: [],
      text: null,
    },
    viewers: []
  }
};