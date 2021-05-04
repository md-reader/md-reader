import { createEle } from '../shared'

export default class Ele {
  tagName: string
  ele: HTMLElement
  display: string

  constructor(tagName: string, attrs) {
    this.ele = createEle(tagName, attrs)
    this.display = this.ele.style.display
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
