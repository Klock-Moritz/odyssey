import type { Preview } from '@storybook/react-vite'

import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'

import { ThemeProvider } from '@mui/material'
import { theme } from '../src/theme.ts'

loader.config({ monaco })
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  decorators: [
    (Story, _context) => (
      <ThemeProvider theme={theme} >
        <Story />
      </ThemeProvider>
    )
  ],
  tags: ['autodocs']
};

export default preview;