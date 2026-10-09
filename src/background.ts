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
    case 'fetchUrl':
      fetchLocalURL(data?.url, sender.url).then(callback)
      break
  }
}

async function fetchLocalURL(url?: string, senderURL?: string) {
  try {
    if (!url || new URL(url).protocol !== 'file:') {
      throw new Error('Only local file URLs are allowed.')
    }
    if (!senderURL || new URL(senderURL).protocol !== 'file:') {
      throw new Error('Local file requests must come from a local page.')
    }
    const response = await fetch(url)
    if (!response.ok && response.status !== 0) {
      throw new Error(`Read failed with status ${response.status}.`)
    }
    return { ok: true, text: await response.text() }
  } catch (error) {
    console.error(error)
    return { ok: false, error: error.message || String(error) }
  }
}

async function fetchData(url?: string) {
  if (!url) {
    const error = new Error('Fetch error: URL is undefined.')
    console.error(error)
    return error.message
  }

  return fetch(url)
    .then(res => res.text())
    .catch(err => {
      console.error(err)
      return err.message
    })
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
