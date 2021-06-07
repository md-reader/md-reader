import storage from './core/storage'

chrome.runtime.onMessage.addListener(({ type, value }) => {
  storage.set({ [type]: value })
})
