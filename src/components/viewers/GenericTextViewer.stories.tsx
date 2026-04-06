import type { Meta, StoryObj } from '@storybook/react-vite';

import { GenericTextViewer } from './GenericTextViewer';

const meta = {
  component: GenericTextViewer,
  args: {
    height: "300px",
  }
} satisfies Meta<typeof GenericTextViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: JSON.stringify({
      "Test": "test"
    }),
    language: "json",
  },
};