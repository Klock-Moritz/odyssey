import type { Meta, StoryObj } from '@storybook/react-vite';

import { RequestMethodSelect } from './RequestMethodSelect';

const meta = {
  component: RequestMethodSelect,
} satisfies Meta<typeof RequestMethodSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};