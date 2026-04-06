import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResponseViewer } from './ResponseViewer';
import { fn } from 'storybook/test';

const meta = {
  component: ResponseViewer,
  args: {
    onFetchRequest: fn(),
  }
} satisfies Meta<typeof ResponseViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    response: {
      headers: new Headers({
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": "697",
        "Link": '<https://api.example.com/items?page=2>; rel="next"; type="application/json", <https://api.example.com/items?page=5>; rel="last"; type="application/json"'
      }),
      ok: false,
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic',
      url: 'https://api.example.com/',
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
        return Promise.resolve(JSON.stringify({
          Test: "test",
          Lorem: "ipsum",
        }));
      }
    }
  },
};