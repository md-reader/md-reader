import storage from '@/core/storage'
import commands from '@/core/commands'

chrome.runtime.onMessage.addListener(({ action, data }, sender, callback) => {
  messageHandler(action, data, sender, callback)
  return true
})

async function messageHandler(
  action: string,
  data: any,
  sender: chrome.runtime.MessageSender,
  callback?: (response?: any) => void,
) {
  switch (action) {
    case 'storage':
      await storage.set({ [data.key]: data.value })
      updatePage(data.key, data.value)
      callback?.(data)
      break
    case 'fetch':
      fetchData(sender.url).then(callback)
      break
  }
}

async function fetchData(url?: string) {
  if (!url) {
    const error = new Error('Fetch error: URL is undefined.')
    console.error(error)
    return error.message
  }

  return fetch(url)
    .then(res =>
      res.arrayBuffer().then(buffer => decodeArrayBuffer(res, buffer)),
    )
    .catch(err => {
      console.error(err)
      return undefined
    })
}

/**
 * Decode the response body respecting the charset declared in the
 * `Content-Type` header. Fall back to UTF-8 when no charset is declared,
 * since `res.text()` previously used the browser's platform default
 * (e.g. windows-1252), which garbled non-ASCII characters like umlauts.
 */
function decodeArrayBuffer(res: Response, buffer: ArrayBuffer) {
  let charset = ''
  try {
    const contentType = res.headers.get('Content-Type') ?? ''
    charset =
      /charset=["']?([\w-]+)/i.exec(contentType)?.[1]?.toLowerCase() ?? ''
  } catch {
    /* ignore header parsing errors */
  }
  try {
    return new TextDecoder(charset || 'utf-8').decode(buffer)
  } catch {
    /* unknown/unsupported charset */
    return new TextDecoder('utf-8').decode(buffer)
  }
}

// Chrome extension shortcuts
chrome.commands.onCommand.addListener(action => {
  commands[action]?.(messageHandler)
})

const actionMap = {
  enable: 'reload',
  refresh: 'toggleRefresh',
  centered: 'toggleCentered',
  mdPlugins: 'updateMdPlugins',
  pageTheme: 'updatePageTheme',
  hiddenSide: 'toggleSide',
}

function updatePage(key: keyof typeof actionMap, value?: any) {
  const action = actionMap[key]
  action &&
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      tabs.length &&
        chrome.tabs.sendMessage(tabs[0].id, { action, data: { key, value } })
    })
}

chrome.runtime.setUninstallURL(
  'https://github.com/orgs/md-reader/discussions/51',
)
