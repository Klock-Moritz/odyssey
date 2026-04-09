import type { Meta, StoryObj } from '@storybook/react-vite';

import { Hyperlink } from './Hyperlink';

const meta = {
  component: Hyperlink,
} satisfies Meta<typeof Hyperlink>;

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

export const OverrideClickingBehavior: Story = {
  args: {
    link: {
      url: "https://example.com/api/items",
      parameters: {
        rel: "self",
      }
    },
    onLinkClick: () => alert("Link clicked!")
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