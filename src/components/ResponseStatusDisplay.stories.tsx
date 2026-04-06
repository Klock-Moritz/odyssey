import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResponseStatusDisplay } from './ResponseStatusDisplay';

const meta = {
  component: ResponseStatusDisplay,
} satisfies Meta<typeof ResponseStatusDisplay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 200,
    statusText: "OK",
    url: "https://api.example.com",
    redirected: false
  },
};

export const Redirected: Story = {
  args: {
    status: 201,
    statusText: "Created",
    url: "https://api.example.com/item/1001",
    redirected: true
  },
};