import type { Meta, StoryObj } from '@storybook/react-vite';

import { HeaderEditor } from './HeaderEditor';
import { createHeaders } from './HeaderViewer.stories';
import { fn } from 'storybook/test';

const meta = {
  component: HeaderEditor,
  args: {
    onUpdateHeaders: fn(),
  }
} satisfies Meta<typeof HeaderEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: createHeaders({
      'Accept': 'application/hal+json, application/json;q=0.9, */*;q=0.8',
      'Accept-Language': 'de-DE, de;q=0.9, en;q=0.8'
    })
  }
};