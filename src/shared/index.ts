import Ele, { getEle } from '../core/ele'

export const HEAD = document.head
export const BODY = document.body
export const SOURCE_SELECTOR = 'pre'
export const HEADERS = 'h1, h2, h3, h4, h5, h6'
export const CONTENT_TYPES = ['text/plain', 'text/markdown']

export function createEle(tagName: string, attrs: any = {}): HTMLElement {
  let { className = [], ...restAttrs } = attrs

  let ele
  if (tagName === 'svg') {
    ele = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  } else {
    ele = document.createElement(tagName)
  }
  if (typeof className === 'string' || className instanceof Array) {
    typeof className === 'string' && (className = className.split(' '))
    addClassName(ele, className)
  }
  Object.keys(restAttrs).forEach(attr => ele.setAttribute(attr, attrs[attr]))
  return ele
}

export function addClassName(ele: HTMLElement, classList: string[]) {
  classList = classList.filter(Boolean)
  ele.classList.add(...classList)
}

export function getAssetsURL(path: string) {
  return chrome.extension.getURL(path)
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
      .filter(item => !item.trim().startsWith('page-theme--'))
      .join(' ') + ` page-theme--${className}`
}

type Svg = {
  attributes: { [attr: string]: string }
  content: string
}

export function svg(options: Svg): Ele {
  const svgEle = new Ele('svg', {
    ...options.attributes,
  })
  svgEle.innerHTML = options.content
  return svgEle
}
