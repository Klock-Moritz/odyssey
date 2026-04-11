import { Button, Stack, type ButtonProps, type StackProps } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { UrlTextField, type UrlTextFieldProps } from "./UrlTextField";
import { RequestMethodSelect, type RequestMethodSelectProps } from "./RequestMethodSelect";
import React from "react";
import { HeaderEditor, type HeaderEditorProps } from "./HeaderEditor";
import { RequestBodyEditor, type RequestBodyEditorProps } from "./RequestBodyEditor";
import { TabGroupEntry } from "./TabGroup";
import { GenericTextEditor } from "./editors/GenericTextEditor";

export type RequestCreatorProps = StackProps & {
  requestMethodSelect?: RequestMethodSelectProps,
  urlTextField?: UrlTextFieldProps,
  button?: ButtonProps,
  requestBodyEditor?: RequestBodyEditorProps,
  headerEditor?: HeaderEditorProps,
  onRequest?: (url: string, options: RequestInit) => void;
  url?: string,
  requestInit?: RequestInit,
  onUpdateUrl?: (url: string) => void,
  onUpdateRequestInit?: (init: RequestInit) => void,
}

export const RequestCreator: React.FC<RequestCreatorProps> = ({
  requestMethodSelect,
  urlTextField,
  button,
  requestBodyEditor,
  headerEditor,
  onRequest,
  gap = 2,
  url,
  requestInit,
  onUpdateUrl,
  onUpdateRequestInit,
  ...props
}) => {
  const [internalUrl, setInternalUrl] = React.useState<string>(
    urlTextField?.defaultValue ? String(urlTextField?.defaultValue) : ""
  );

  const [internalRequestInit, setInternalRequestInit] = React.useState<RequestInit>({
    method: requestMethodSelect?.defaultValue ?? "GET",
    headers: headerEditor?.defaultValue ?? new Headers(),
    body: requestBodyEditor?.defaultBodyContent?.body,
  });

  const realUrl = url || internalUrl;
  const realRequestInit = requestInit || internalRequestInit;

  function updateRequestInit(updates: Partial<RequestInit>) {
    const newRequestInit = { ...realRequestInit, ...updates };
    if (!requestInit) {
      setInternalRequestInit(newRequestInit);
    }
    if (onUpdateRequestInit) {
      onUpdateRequestInit(newRequestInit);
    }
  }

  function updateUrl(newUrl: string) {
    if (!url) {
      setInternalUrl(newUrl);
    }
    if (onUpdateUrl) {
      onUpdateUrl(newUrl);
    }
  }

  function submitForm() {
    onRequest?.(realUrl, realRequestInit);
  }

  function getHeaders(...updates: ((headers: Headers) => void)[]): Headers {
    const headers = new Headers(realRequestInit.headers);
    updates.forEach(update => update(headers));
    return headers;
  }

  return (
    <Stack {...props} gap={gap}>
      <form onSubmit={(event) => {
        event.preventDefault();
        submitForm();
      }}>
        <Stack direction="row" alignItems="center">
          <RequestMethodSelect id="method" required {...requestMethodSelect} size="small"
            sx={{
              '& fieldset': {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }
            }}
            value={realRequestInit.method}
            onChange={e => updateRequestInit({ method: e.target.value })}
          />
          <UrlTextField id="url" required {...urlTextField} value={realUrl}
            fullWidth size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderRadius: 0
                }
              }
            }}
            onChange={e => updateUrl(e.target.value)} />
          <Button {...button} sx={{
            height: "40px",
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0",
            boxShadow: "none !important",
            minWidth: "fit-content"
          }}
            variant="contained"
            endIcon={<SendIcon />}
            type="submit">Request</Button>
          <RequestBodyEditor {...requestBodyEditor} sx={{
            marginLeft: "16px",
            minWidth: "fit-content"
          }}
            editors={[
              {
                predicate: () => true,
                renderer: async (updateBody, body, contentType) => {
                  const initialValue = body ? String(body) : "";
                  const possibleLanguage = contentType.structuredSyntaxSuffix || contentType.innerSubtype;
                  return {
                    initialBody: initialValue,
                    editor: (
                      <TabGroupEntry label={`Edit ${possibleLanguage}`} key="edit-body">
                        <GenericTextEditor language={possibleLanguage} initialValue={initialValue} onUpdateValue={updateBody} />
                      </TabGroupEntry>
                    )
                  }
                }
              }
            ]}
            bodyContent={getHeaders().has("content-type") ? {
              contentType: getHeaders().get("content-type")!,
              body: realRequestInit.body || "",
            } : null}
            onUpdateBodyContent={content => {
              if (content) {
                updateRequestInit({
                  headers: getHeaders(headers => headers.set("content-type", content.contentType)),
                  body: content.body
                });
              } else {
                updateRequestInit({
                  headers: getHeaders(headers => headers.delete("content-type")),
                  body: undefined
                });
              }
            }}
            onDirectRequest={submitForm} />
        </Stack>
      </form>
      <HeaderEditor value={getHeaders()} onUpdateHeaders={headers => updateRequestInit({ headers })} />
    </Stack>
  )
}