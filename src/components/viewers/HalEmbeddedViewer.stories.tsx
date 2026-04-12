import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { HalEmbeddedViewer } from './HalEmbeddedViewer';
import { responsePipeline } from '../../model/response-pipeline';
import { ResponseBodyViewer } from '../ResponseBodyViewer';
import { halJsonResponse } from '../../model/samples';

const meta = {
  component: HalEmbeddedViewer,
  args: {
    onLinkClick: fn(),
    childViewerCreator: async (child) => (
      <ResponseBodyViewer response={await responsePipeline(new Response(JSON.stringify(child), {
        headers: {
          "Content-Type": "application/hal+json"
        }
      }))} />
    ),
  }
} satisfies Meta<typeof HalEmbeddedViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    resource: "isHalResource" in halJsonResponse ? halJsonResponse.json : {},
  }
};