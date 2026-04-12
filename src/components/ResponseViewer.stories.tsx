import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResponseViewer } from './ResponseViewer';
import { fn } from 'storybook/test';
import { halJsonResponse } from '../model/samples';

const meta = {
  component: ResponseViewer,
  args: {
    handleRequest: fn(),
  }
} satisfies Meta<typeof ResponseViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    response: halJsonResponse,
  },
};