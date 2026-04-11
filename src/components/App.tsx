import { useState } from 'react'
import { RequestCreator } from './RequestCreator'
import { ResponseViewer } from './ResponseViewer'
import { Alert, Stack } from '@mui/material'
import { responsePipeline, type ProcessedResponse } from '../model/response-pipeline'

export type AppProps = {
  defaultUrl?: string,
  defaultRequestInit?: RequestInit,
}

const App: React.FC<AppProps> = ({
  defaultUrl,
  defaultRequestInit,
}) => {
  const [url, setUrl] = useState<string>(defaultUrl ?? "")
  const [requestInit, setRequestInit] = useState<RequestInit>(defaultRequestInit ?? { method: "GET" })
  const [response, setResponse] = useState<ProcessedResponse>()
  const [error, setError] = useState<unknown>()

  async function onFetchRequest(url: string, options?: RequestInit, keepForEdit: boolean = false) {
    try {
      setUrl(url)
      setRequestInit(options ?? { method: "GET" })
      if (!keepForEdit) {
        setResponse(await responsePipeline(await fetch(url, options)));
        setError(undefined)
      }
    } catch (error) {
      setResponse(undefined)
      setError(error)
      console.error(error);
    }
  }

  return (
    <Stack gap={2}>
      <RequestCreator onRequest={onFetchRequest}
        url={url} requestInit={requestInit}
        onUpdateUrl={setUrl} onUpdateRequestInit={setRequestInit} />

      {response && <ResponseViewer response={response} onFetchRequest={onFetchRequest} />}
      {error !== undefined && <Alert severity="error">{String(error)}</Alert>}
    </Stack>
  )
}

export default App
