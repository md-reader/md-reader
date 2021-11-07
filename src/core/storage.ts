import type Data from './data'

class Storage<T> {
  local: chrome.storage.LocalStorageArea
  constructor() {
    this.local = chrome.storage.local
  }
  set(data: T): Promise<T> {
    return new Promise((resolve) => {
      this.local.set(data, resolve.bind(null, data))
    })
  }
  get(keys: keyof T[] | keyof T = null): Promise<T> {
    return new Promise((resolve) => this.local.get(keys, resolve))
  }
}

export default new Storage<Data>()
