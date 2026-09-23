// Runs on pages whose URL has no markdown extension. When the server declared
// the document as markdown, asks the background to inject the reader, so
// generated documents without a `.md` path are rendered too.
const MARKDOWN_CONTENT_TYPES = ['text/markdown', 'text/x-markdown']

if (MARKDOWN_CONTENT_TYPES.includes(document.contentType)) {
  chrome.runtime.sendMessage({ action: 'inject' })
}

export {}
