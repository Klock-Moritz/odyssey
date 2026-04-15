import type { Meta, StoryObj } from '@storybook/react-vite';

import { RequestBodyEditor } from './RequestBodyEditor';
import { fn } from 'storybook/test';
import { TabGroupEntry } from './TabGroup';
import { TextField } from '@mui/material';

const meta = {
  component: RequestBodyEditor,
  args: {
    onUpdateBodyContent: fn(),
    editors: [
      {
        predicate: () => true,
        renderer: async (updateBody, body) => {
          const initialBody = body ? String(body) : "";
          return {
            initialBody,
            editor: [
              <TabGroupEntry label="Edit text" key="edit-body">
                <TextField multiline fullWidth minRows={10} defaultValue={initialBody} onChange={e => updateBody(e.target.value)} />
              </TabGroupEntry>
            ],
          };
        },
      }
    ],
  }
} satisfies Meta<typeof RequestBodyEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EditBody: Story = {
  args: {
    defaultBodyContent: {
      contentType: "text/plain",
      body: "Lorem ipsum dolor sit amet",
    },
  }
};