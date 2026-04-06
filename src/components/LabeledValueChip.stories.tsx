import type { Meta, StoryObj } from '@storybook/react-vite';

import { LabeledValueChip } from './LabeledValueChip';

const meta = {
  component: LabeledValueChip,
} satisfies Meta<typeof LabeledValueChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    value: "Value",
  }
};