import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { HyperlinkChip } from './HyperlinkChip';

const meta = {
  component: HyperlinkChip,
  args: {
    onLinkClick: fn(),
  }
} satisfies Meta<typeof HyperlinkChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    link: {
      url: "https://example.com/api/items",
      parameters: {
        rel: "self",
      }
    }
  }
};

export const WithTitle: Story = {
  args: {
    link: {
      "url": "https://example.com/api/items",
      "parameters": {
        "rel": "self",
        "title": "All items"
      }
    }
  }
};

export const AdditionalInformation: Story = {
  args: {
    link: {
      "url": "https://example.com/api/items",
      "parameters": {
        "rel": "self",
        "title": "All items",
        "type": "application/json",
        "hreflang": "en"
      }
    }
  }
};

export const URLTemplate: Story = {
  args: {
    link: {
      url: "https://example.com/api/items/{id}",
      parameters: {
        rel: "item",
        templated: true,
      }
    }
  }
};

export const Deprecated: Story = {
  args: {
    link: {
      url: "https://example.com/api/items",
      parameters: {
        rel: "item",
        title: "All items",
        deprecation: "https://example.com/blog/items-link-deprecated"
      }
    }
  }
};