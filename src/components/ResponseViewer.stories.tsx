import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResponseViewer } from './ResponseViewer';
import { fn } from 'storybook/test';
import { MediaType } from '../utils/media-type';

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
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Length": "697",
        "Link": '<https://api.example.com/items?page=2>; rel="next"; type="application/json", <https://api.example.com/items?page=5>; rel="last"; type="application/json"'
      },
      contentType: new MediaType("text/plain; charset=utf-8"),
      bodyUsed: true,
      ok: true,
      links: [
        {
          url: "https://api.example.com/items?page=2",
          parameters: {
            rel: "next",
            type: "application/json"
          }
        },
        {
          url: "https://api.example.com/items?page=5",
          parameters: {
            rel: "last",
            type: "application/json"
          }
        }
      ],
      body: null,
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic',
      url: 'https://api.example.com/',
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor."
    }
  },
};