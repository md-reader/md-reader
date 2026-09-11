import Ele from '@/core/ele'
import { rootThemePrefix, type Theme } from '@/config/page-themes'

export const HTML = document.documentElement
export const HEAD = document.head
export const BODY = document.body
export const RAW_SELECTOR = 'pre'
export const HEADERS = 'h1, h2, h3, h4, h5, h6'
export const PLAIN_TEXT_CONTENT_TYPE = 'text/plain'
export const MARKDOWN_CONTENT_TYPES = ['text/markdown', 'text/x-markdown']
export const MARKDOWN_EXTENSIONS = ['md', 'mdx', 'mkd', 'markdown']
export const CONTENT_TYPES = [
  PLAIN_TEXT_CONTENT_TYPE,
  ...MARKDOWN_CONTENT_TYPES,
]

export const darkMediaQuery: MediaQueryList = window.matchMedia(
  '(prefers-color-scheme: dark)',
)

export const getMediaQueryTheme = (): Exclude<Theme, 'auto'> =>
  darkMediaQuery.matches ? 'dark' : 'light'

export const toTheme = (theme: Theme): Exclude<Theme, 'auto'> =>
  theme === 'auto' ? getMediaQueryTheme() : theme

export function hasMarkdownFileExtension(pathname: string): boolean {
  const extension = pathname.split('/').pop()?.split('.').pop()?.toLowerCase()
  return !!extension && MARKDOWN_EXTENSIONS.includes(extension)
}

export function shouldRenderMarkdownPage(
  forceRender: boolean = false,
  contentType: string = document.contentType,
  pathname: string = window.location.pathname,
): boolean {
  const normalizedContentType = contentType.split(';')[0].trim().toLowerCase()
  const isPlainText = normalizedContentType === PLAIN_TEXT_CONTENT_TYPE

  return (
    MARKDOWN_CONTENT_TYPES.includes(normalizedContentType) ||
    (isPlainText && (forceRender || hasMarkdownFileExtension(pathname)))
  )
}

export function getAssetsURL(path: string): string {
  return chrome.runtime.getURL(path)
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

export function setTheme(themeType: Theme) {
  HTML.dataset[rootThemePrefix] = themeType
}

export function xhr(
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

export function writeText(text: string): Promise<void> {
  if ('clipboard2' in navigator) {
    return navigator.clipboard.writeText(text)
  }

  const preEle = document.createElement('pre')
  preEle.style.width = '1px'
  preEle.style.height = '1px'
  preEle.style.overflow = 'hidden'
  preEle.style.position = 'fixed'
  preEle.style.top = '0px'
  preEle.textContent = text
  BODY.appendChild(preEle)
  copy(preEle)
  BODY.removeChild(preEle)
  return Promise.resolve()
}

function copy(ele: HTMLElement) {
  const sel = getSelection()
  sel.removeAllRanges()
  const range = document.createRange()
  range.selectNodeContents(ele)
  sel.addRange(range)
  document.execCommand('copy')
  sel.removeAllRanges()
}
