import type { Meta, StoryObj } from '@storybook/react-vite';

import { CsvViewer } from './CsvViewer';

const meta = {
  component: CsvViewer,
} satisfies Meta<typeof CsvViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "text": "1001,Notebook,Stationary,1\r\n1002,Pen,Stationary,1\r\n1003,Water Bottle,Accessories,1\r\n"
  },
};

export const WithHeader: Story = {
  args: {
    text: "id,name,category,inStock\n1001,Notebook,Stationary,1\n1002,Pen,Stationary,1\n1003,Water Bottle,Accessories,1\n",
    header: true,
  }
};

export const TabSeparetedValues: Story = {
  args: {
    text: "id\tname\tcategory\tinStock\n1001\tNotebook\tStationary\t1\n1002\tPen\tStationary\t1\n1003\tWater Bottle\tAccessories\t1\n",
    header: true,
    delimiter: '\t'
  }
};