import { createEle, getEle } from '../shared'

export default class Ele {
  ele: HTMLElement
  display: string

  constructor(tagName: string, attrs) {
    this.ele = createEle(tagName, attrs)
    this.display = this.ele.style.display
  }

  set innerHTML(content: string) {
    this.ele.innerHTML = content
  }
  set textContent(content: string) {
    this.ele.textContent = content
  }

  query(selectors: string) {
    return this.ele.querySelector(selectors)
  }
  queryAll(selectors: string): HTMLElement[] {
    return Array.from(this.ele.querySelectorAll(selectors))
  }
  remove() {
    this.ele.parentNode.removeChild(this.ele)
  }
  toggle(status: boolean, display?) {
    status ? this.show(display) : this.hidden()
  }
  show(display?) {
    this.ele.style.display = display || this.display
  }
  hidden() {
    this.ele.style.display = 'none'
  }
  appendChild(newChild: HTMLElement | Ele): Node {
    return this.ele.appendChild(getEle(newChild))
  }
  insertBefore(newChild: HTMLElement | Ele, refChild: HTMLElement | Ele): Node {
    return this.ele.insertBefore(getEle(newChild), getEle(refChild))
  }
  addEventListener(
    eventType: keyof HTMLElementEventMap,
    listener: (Event) => any,
  ) {
    this.ele.addEventListener(eventType, listener)
  }
  removeEventListener(
    eventType: keyof HTMLElementEventMap,
    listener: (Event) => any,
  ) {
    this.ele.removeEventListener(eventType, listener)
  }
}