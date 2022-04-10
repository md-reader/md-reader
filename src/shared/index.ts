import Ele, { type Attrs } from '../core/ele'
import themeTypes, { themePrefix, type Theme } from '../config/page-themes'

export const HEAD = document.head
export const BODY = document.body
export const RAW_SELECTOR = 'pre'
export const HEADERS = 'h1, h2, h3, h4, h5, h6'
export const CONTENT_TYPES = ['text/plain', 'text/markdown']

export function getAssetsURL(path: string): string {
  return chrome.extension.getURL(path)
}

export function getRawContainer(selector: string = RAW_SELECTOR): HTMLElement {
  return BODY.querySelector(selector)
}

export function getHeads(
  container: HTMLElement | Ele,
  selector: string = HEADERS,
): Array<HTMLElement> {
  return Array.from(Ele.from(container).querySelectorAll(selector))
}

let allThemeClassNames = null
export function setTheme(themeType: Theme) {
  if (!allThemeClassNames) {
    allThemeClassNames = themeTypes.map(type => `${themePrefix}${type}`)
  }
  BODY.classList.remove(...allThemeClassNames)
  BODY.classList.add(`${themePrefix}${themeType}`)
}

export function fetch(
  url: string,
  method: string = 'GET',
  body?: Document | XMLHttpRequestBodyInit,
): Promise<EventTarget> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = ({ target }) => {
      const { readyState, status } = xhr
      if (readyState === xhr.DONE) {
        if (status === 0 || (status >= 200 && status < 400)) {
          resolve(target)
        } else {
          reject(new Error('Request failed'))
        }
      }
    }
    xhr.onerror = reject
    xhr.open(method, url)
    xhr.send(body)
  })
}
