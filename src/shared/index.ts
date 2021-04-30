export const HEAD = document.head
export const BODY = document.body

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
