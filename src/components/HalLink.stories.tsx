import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { HalLink } from './HalLink';

const meta = {
  component: HalLink,
  args: {
    onLinkClick: fn(),
  }
} satisfies Meta<typeof HalLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    link: {
      href: "https://example.com/api/items",
    }
  }
};

export const WithTitle: Story = {
  args: {
    link: {
      href: "https://example.com/api/items",
      title: "All items"
    }
  }
};

export const TemplatedLink: Story = {
  args: {
    link: {
      href: "https://example.com/api/items/{id}",
      templated: true,
      title: "Item details"
    }
  }
};

export const Deprecated: Story = {
  args: {
    link: {
      href: "https://example.com/api/items",
      title: "All items",
      deprecation: "https://example.com/blog/items-link-deprecated",
    }
  }
};