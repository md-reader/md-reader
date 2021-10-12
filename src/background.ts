import storage from './core/storage'

chrome.runtime.onMessage.addListener(({ type, value }, _sender, callback) => {
  switch (type) {
    case 'storage':
      storage.set({ [value.key]: value.value })
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

function fetch(url, method = 'GET', params?): Promise<any> {
  return new Promise((resolve, reject) => {
    const xml = new XMLHttpRequest()
    xml.onreadystatechange = ({ target }) => {
      if (xml.readyState === 4) {
        resolve(target)
      }
    }
    xml.onerror = reject
    xml.open(method, url)
    xml.send(params)
  })
}
