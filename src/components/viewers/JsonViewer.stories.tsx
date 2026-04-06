import type { Meta, StoryObj } from '@storybook/react-vite';

import { JsonViewer } from './JsonViewer';

const meta = {
  component: JsonViewer,
} satisfies Meta<typeof JsonViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      test: "Test",
      array: [
        "Test", "More tests"
      ]
    }
  }
};