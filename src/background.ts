import storage from './core/storage'
import { fetch } from './shared'

chrome.runtime.onMessage.addListener(({ type, value }, _sender, callback) => {
  switch (type) {
    case 'storage':
      storage.set({ [value.key]: value.value })
      updatePage(value.key, value.value)
      break
    case 'fetch':
      fetch(value)
        .then((res: XMLHttpRequest) => callback && callback(res.responseText))
        .catch(err => {
          console.error(err)
          callback()
        })
      break
  }
  return true
})

const actions = {
  enable: 'reload',
  refresh: 'switchRefresh',
  centered: 'switchCentered',
  mdPlugins: 'updateMdPlugins',
  pageTheme: 'updatePageTheme',
}

function updatePage(key: string, value: any) {
  const action = actions[key]

  action &&
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      tabs.length &&
        chrome.tabs.sendMessage(tabs[0].id, { type: action, key, value })
    })
}
