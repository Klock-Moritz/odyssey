import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Hyperlink } from './Hyperlink';

const meta = {
  component: Hyperlink,
  args: {
    onLinkClick: fn(),
  }
} satisfies Meta<typeof Hyperlink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "https://example.com/api/items",
  }
};

export const WithTitle: Story = {
  args: {
    href: "https://example.com/api/items",
    parameters: {
      title: "All items"
    }
  }
};

export const TemplatedLink: Story = {
  args: {
    href: "https://example.com/api/items/{id}",
    parameters: {
      templated: true,
      title: "Item details"
    }
  }
};

export const Deprecated: Story = {
  args: {
    href: "https://example.com/api/items",
    parameters: {
      title: "All items",
      deprecation: "https://example.com/blog/items-link-deprecated",
    }
  }
};

export const HideURLTooltip: Story = {
  args: {
    href: "https://example.com/api/items",
    parameters: {
      title: "All items"
    },
    hideUrl: true,
  }
};