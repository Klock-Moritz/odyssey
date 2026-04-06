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
      rel: "self",
      url: "https://example.com/api/items",
    }
  }
};

export const OverrideClickingBehavior: Story = {
  args: {
    link: {
      rel: "self",
      url: "https://example.com/api/items",
    },
    onLinkClick: () => alert("Link clicked!")
  }
};

export const WithTitle: Story = {
  args: {
    link: {
      "rel": "self",
      "url": "https://example.com/api/items",
      "title": "All items"
    }
  }
};

export const AdditionalInformation: Story = {
  args: {
    link: {
      "rel": "self",
      "url": "https://example.com/api/items",
      "title": "All items",
      "type": "application/json",
      "hreflang": "en"
    }
  }
};