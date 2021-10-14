import Ele from '../core/ele'

export const HEAD = document.head
export const BODY = document.body
export const SOURCE_SELECTOR = 'pre'
export const HEADERS = 'h1, h2, h3, h4, h5, h6'
export const CONTENT_TYPES = ['text/plain', 'text/markdown']

export function createEle(tagName: string, attrs: any = {}): HTMLElement {
  let { className = [], ...restAttrs } = attrs

  const ele = document.createElement(tagName)
  if (typeof className === 'string' || className instanceof Array) {
    typeof className === 'string' && (className = className.split(' '))
    addClassName(ele, className)
  }
  Object.keys(restAttrs).forEach((attr) => ele.setAttribute(attr, attrs[attr]))
  return ele
}

export function addClassName(ele: HTMLElement, classList: string[]) {
  classList = classList.filter(Boolean)
  ele.classList.add(...classList)
}

export function getAssetsURL(path: string) {
  return chrome.extension.getURL(path)
}

export function getEle(
  node: HTMLElement | DocumentFragment | Ele,
): HTMLElement | DocumentFragment {
  if (node instanceof Ele) {
    return node.ele
  }
  return node
}

export function getHeads(
  container: HTMLElement | Ele,
  selector: string = HEADERS,
): Array<HTMLElement> {
  return Array.from(getEle(container).querySelectorAll(selector))
}

export function setPageTheme(className: string) {
  BODY.className =
    BODY.className
      .split(' ')
      .filter((item) => !item.trim().startsWith('page-theme--'))
      .join(' ') + ` page-theme--${className}`
}
