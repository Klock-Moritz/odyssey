import type { Meta, StoryObj } from '@storybook/react-vite';

import { TableViewer } from './TableViewer';

const meta = {
  component: TableViewer,
} satisfies Meta<typeof TableViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      hasHeader: true,
      header: ["id", "name", "age"],
      records: [
        { id: 1, name: "Alice", age: 30 },
        { id: 2, name: "Bob", age: 25 },
        { id: 3, name: "Charlie", age: 35 },
      ]
    }
  },
};

export const WithArrays: Story = {
  args: {
    data: {
      hasHeader: false,
      header: [0, 1, 2],
      records: [
        [1, "Alice", 30],
        [2, "Bob", 25],
        [3, "Charlie", 35],
      ]
    }
  },
};