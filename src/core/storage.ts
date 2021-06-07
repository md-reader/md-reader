class Storage {
  local: chrome.storage.LocalStorageArea
  constructor() {
    this.local = chrome.storage.local
  }
  set(items: Object): Promise<any> {
    return new Promise((resolve) =>
      this.local.set(items, resolve.bind(null, items)),
    )
  }
  get(items: string[] | string = null): Promise<any> {
    return new Promise((resolve) => this.local.get(items, resolve))
  }
}

export default new Storage()
