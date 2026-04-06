import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { HalLinkViewer } from './HalLinkViewer';

const meta = {
  component: HalLinkViewer,
  args: {
    onLinkClick: fn(),
  }
} satisfies Meta<typeof HalLinkViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    links: {
      self: [
        {
          href: "https://example.com/api/items",
          title: "All items",
        }
      ],
      next: [
        {
          href: "https://example.com/api/items?page=2",
          title: "Next page",
        }
      ],
      item: [
        {
          href: "https://example.com/api/items/{id}",
          templated: true,
          profile: "https://example.com/profiles/item",
        }
      ],
      alternate: [
        {
          href: "https://example.com/api/items",
          type: "application/xml",
          name: "xml-en",
        },
        {
          href: "https://example.com/api/items",
          hreflang: "de",
          name: "hal-de",
        },
        {
          href: "https://example.com/api/items",
          type: "application/json",
          deprecation: "https://example.com/blog/json-representation-deprecated",
          name: "json-en",
        },
      ]
    }
  }
};