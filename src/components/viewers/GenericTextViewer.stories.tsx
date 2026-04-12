import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { GenericTextViewer } from './GenericTextViewer';

const meta = {
  component: GenericTextViewer,
  args: {
    height: "300px",
    onUpdateData: fn(),
  }
} satisfies Meta<typeof GenericTextViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: JSON.stringify({
      "Test": "test"
    }, undefined, 2),
    language: "json",
  },
};

export const WithoutUpdateFunction: Story = {
  args: {
    data: JSON.stringify({
      "Test": "test"
    }, undefined, 2),
    language: "json",
    onUpdateData: undefined,
  },
};