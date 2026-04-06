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
        rel: "self",
        url: "https://example.com/api/items",
      },
      {
        rel: "alternate",
        url: "https://example.com/api/items",
        type: "application/xml"
      },
      {
        rel: "index",
        url: "https://example.com/api/",
        title: "API index"
      }
    ]
  }
};