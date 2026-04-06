import type { Meta, StoryObj } from '@storybook/react-vite';

import { TableViewer } from './TableViewer';

const meta = {
  component: TableViewer,
} satisfies Meta<typeof TableViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fields: [
      "id",
      "name",
      "category",
      "inStock"
    ],
    rows: [
      { id: 1001, name: 'Notebook', category: 'Stationery', inStock: true },
      { id: 1002, name: 'Pen', category: 'Stationery', inStock: true },
      { id: 1003, name: 'Water Bottle', category: 'Accessories', inStock: true },
    ]
  },
};