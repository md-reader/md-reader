import Data from './data'

class Storage {
  local: chrome.storage.LocalStorageArea
  constructor() {
    this.local = chrome.storage.local
  }
  set(data: Data): Promise<any> {
    console.log('save', data)
    return new Promise((resolve) => {
      this.local.set(data, resolve.bind(null, data))
    })
  }
  get(keys: keyof Data[] | keyof Data = null): Promise<Data> {
    return new Promise((resolve) =>
      this.local.get(keys, (data: Data) => {
        resolve(data)
      }),
    )
  }
}

export default new Storage()
