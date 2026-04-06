import type { Meta, StoryObj } from '@storybook/react-vite';

import { UrlTextField } from './UrlTextField';

const meta = {
  component: UrlTextField,
} satisfies Meta<typeof UrlTextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};