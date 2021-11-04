import storage from './core/storage'

chrome.runtime.onMessage.addListener(({ type, value }, _sender, callback) => {
  switch (type) {
    case 'storage':
      storage.set({ [value.key]: value.value })
      updatePage(value.key, value.value)
      break
    case 'tryReload':
      fetch(value)
        .then((res: XMLHttpRequest) => {
          callback && callback(res.responseText)
        })
        .catch(console.error)
      break
  }
  return true
})

function fetch(url: string, method: string = 'GET', params?): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.onreadystatechange = ({ target }) => {
      if (req.readyState === req.DONE) {
        if (req.status === 200) {
          resolve(target)
        } else if (req.status === 404) {
          reject(new Error('404 Not Found'))
        }
      }
    }
    req.onerror = reject
    req.open(method, url)
    req.send(params)
  })
}

function updatePage(type: string, value: any) {
  let action: string
  switch (type) {
    case 'enable':
      action = 'reload'
      break
    case 'mdPlugins':
      action = 'updateMdPlugins'
      break
    case 'pageTheme':
      action = 'updatePageTheme'
      break
    case 'refresh':
      action = 'toggleRefresh'
      break
  }

  action &&
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: action, value })
    })
}
