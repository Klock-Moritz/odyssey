import type { Meta, StoryObj } from '@storybook/react-vite';

import { JsonViewer } from './JsonViewer';
import { halJsonResponse } from '../../model/samples';

const meta = {
  component: JsonViewer,
} satisfies Meta<typeof JsonViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: "data" in halJsonResponse ? halJsonResponse.data : {},
  }
};