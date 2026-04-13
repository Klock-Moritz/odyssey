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
    resource: "hal" in halJsonResponse ? halJsonResponse.hal : {},
  }
};

export const ComplexResources: Story = {
  args: {
    resource: {
      _embedded: {
        author: {
          _links: {
            self: {
              href: "https://example.com/api/authors/42",
              title: "John Doe",
              name: "42",
            },
          },
          id: 42,
          name: "John Doe",
          _embedded: {
            help: {
              title: "Author resource help",
              description: "This resource represents an author. It contains the author's ID and name, as well as a link to the author's details. The embedded 'help' resource provides additional information about the author resource."
            }
          }
        },
        help: {
          title: "Item collection help",
          description: "This collection contains items that are available in our store. Each item has an ID, name, category, and stock status. You can use the provided links to access individual item details or related resources.",
        }
      }
    }
  }
};