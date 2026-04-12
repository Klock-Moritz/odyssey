import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { HyperlinkViewer } from './HyperlinkViewer';

const meta = {
  component: HyperlinkViewer,
  args: {
    onLinkClick: fn(),
  }
} satisfies Meta<typeof HyperlinkViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    links: [
      {
        url: "https://example.com/api/items",
        parameters: {
          rel: "self",
        }
      },
      {
        url: "https://example.com/api/items",
        parameters: {
          rel: "alternate",
          type: "application/xml"
        }
      },
      {
        url: "https://example.com/api/",
        parameters: {
          rel: "index",
          title: "API index"
        }
      },
      {
        url: "https://example.com/api/items/{id}",
        parameters: {
          rel: "item",
          templated: true,
        }
      },
    ]
  }
};