import type { Meta, StoryObj } from '@storybook/react-vite';

import { HeaderViewer } from './HeaderViewer';

const meta = {
  component: HeaderViewer,
} satisfies Meta<typeof HeaderViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headers: createHeaders({
      "Content-Type": "application/hal+json",
      "Accept": "application/json",
    })
  }
};

export function createHeaders(headers: { [name: string]: string}) {
  const obj = new Headers();
  Object.keys(headers).forEach(name => obj.set(name, headers[name]));
  return obj;
}