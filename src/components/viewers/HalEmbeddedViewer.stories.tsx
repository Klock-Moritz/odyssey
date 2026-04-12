import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { HalEmbeddedViewer } from './HalEmbeddedViewer';
import { createHalViewer } from '../ResponseViewer';
import { responsePipeline } from '../../model/response-pipeline';

const meta = {
  component: HalEmbeddedViewer,
  args: {
    onLinkClick: fn(),
    childViewer: async (child: any) => await createHalViewer(await responsePipeline(
      new Response(JSON.stringify(child), {
        headers: {
          "content-type": "application/hal+json",
        }
      }))
    ),
  }
} satisfies Meta<typeof HalEmbeddedViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    resource: {
      _links: {
        item: {
          href: "https://example.com/api/items/{id}",
          templated: true,
        }
      },
      _embedded: {
        item: [
          {
            id: 1001,
            name: "Notebook",
            category: "Stationery",
            inStock: true
          },
          {
            id: 1002,
            name: "Pen",
            category: "Stationery",
            inStock: true
          },
          {
            id: 1003,
            name: "Water Bottle",
            category: "Accessories",
            inStock: true
          },
          {
            id: 1004,
            name: "Backpack",
            category: "Bags",
            inStock: false
          },
        ],
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