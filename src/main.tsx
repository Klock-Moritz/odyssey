import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'
import { ThemeProvider } from '@mui/material'
import { theme } from './theme.ts'

loader.config({ monaco })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App defaultUrl={new URLSearchParams(window.location.search).get('url') ?? undefined} />
    </ThemeProvider>
  </StrictMode>,
)
