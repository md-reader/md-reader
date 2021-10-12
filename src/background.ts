import storage from './core/storage'

chrome.runtime.onMessage.addListener(
  async ({ type, value }, _sender, callback) => {
    switch (type) {
      case 'storage':
        storage.set({ [value.key]: value.value })
        break
      case 'tryReload':
        const res: XMLHttpRequest = await fetch(value)
        callback && callback(res.responseText)
        break
    }
  },
)

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
