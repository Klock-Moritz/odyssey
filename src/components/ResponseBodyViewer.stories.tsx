import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResponseBodyViewer } from './ResponseBodyViewer';
import { createHeaders } from './HeaderViewer.stories';
import { TabGroupEntry } from './TabGroup';
import { Typography } from '@mui/material';

const meta = {
  component: ResponseBodyViewer,
} satisfies Meta<typeof ResponseBodyViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    response: {
      headers: new Headers({
        'content-type': 'text/plain',
      }),
      ok: false,
      redirected: false,
      status: 0,
      statusText: '',
      type: 'basic',
      url: '',
      clone: function (): Response {
        throw new Error('Function not implemented.');
      },
      body: null,
      bodyUsed: false,
      arrayBuffer: function (): Promise<ArrayBuffer> {
        throw new Error('Function not implemented.');
      },
      blob: function (): Promise<Blob> {
        throw new Error('Function not implemented.');
      },
      bytes: function (): Promise<Uint8Array<ArrayBuffer>> {
        throw new Error('Function not implemented.');
      },
      formData: function (): Promise<FormData> {
        throw new Error('Function not implemented.');
      },
      json: function (): Promise<any> {
        throw new Error('Function not implemented.');
      },
      text: function (): Promise<string> {
        return Promise.resolve("Lorem ipsum dolor sit amet.")
      }
    },
    viewers: [
      {
        predicate: () => true,
        renderer: async (response) => (
          <TabGroupEntry label="Text">
            <Typography>{await response.text()}</Typography>
          </TabGroupEntry>
        )
      }
    ]
  }
};

export const NoViewer: Story = {
  args: {
    response: {
      headers: createHeaders({
        "content-type": "application/json"
      }),
      ok: false,
      redirected: false,
      status: 0,
      statusText: '',
      type: 'basic',
      url: '',
      clone: function (): Response {
        throw new Error('Function not implemented.');
      },
      body: null,
      bodyUsed: false,
      arrayBuffer: function (): Promise<ArrayBuffer> {
        throw new Error('Function not implemented.');
      },
      blob: function (): Promise<Blob> {
        throw new Error('Function not implemented.');
      },
      bytes: function (): Promise<Uint8Array<ArrayBuffer>> {
        throw new Error('Function not implemented.');
      },
      formData: function (): Promise<FormData> {
        throw new Error('Function not implemented.');
      },
      json: function (): Promise<any> {
        throw new Error('Function not implemented.');
      },
      text: function (): Promise<string> {
        throw new Error('Function not implemented.');
      }
    },
    viewers: []
  }
};

export const NoContentType: Story = {
  args: {
    response: {
      headers: new Headers(),
      ok: false,
      redirected: false,
      status: 0,
      statusText: '',
      type: 'basic',
      url: '',
      clone: function (): Response {
        throw new Error('Function not implemented.');
      },
      body: null,
      bodyUsed: false,
      arrayBuffer: function (): Promise<ArrayBuffer> {
        throw new Error('Function not implemented.');
      },
      blob: function (): Promise<Blob> {
        throw new Error('Function not implemented.');
      },
      bytes: function (): Promise<Uint8Array<ArrayBuffer>> {
        throw new Error('Function not implemented.');
      },
      formData: function (): Promise<FormData> {
        throw new Error('Function not implemented.');
      },
      json: function (): Promise<any> {
        throw new Error('Function not implemented.');
      },
      text: function (): Promise<string> {
        throw new Error('Function not implemented.');
      }
    },
    viewers: []
  }
};