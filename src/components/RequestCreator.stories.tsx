import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from "storybook/test";

import { RequestCreator } from './RequestCreator';

const meta = {
  component: RequestCreator,
  args: {
    handleRequest: fn(),
  }
} satisfies Meta<typeof RequestCreator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ControlledState: Story = {
  args: {
    url: "https://example.com/api/items",
    requestInit: {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "Accept": "application/json",
      }),
      body: JSON.stringify({
        name: "New item",
        description: "This is a new item.",
      }),
    }
  }
};