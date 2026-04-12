import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ResponseBodyViewer } from './ResponseBodyViewer';
import { csvResponse, halJsonResponse } from '../model/samples';

const meta = {
  component: ResponseBodyViewer,
  args: {
    handleRequest: fn(),
  }
} satisfies Meta<typeof ResponseBodyViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    response: halJsonResponse
  }
};

export const CSVResponse: Story = {
  args: {
    response: csvResponse
  }
};