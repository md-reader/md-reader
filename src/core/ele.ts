export type ElementType = HTMLElement | SVGSVGElement | DocumentFragment
export type Attrs = { className?: string | string[] } | { [k: string]: string }

export default class Ele<T extends ElementType = ElementType> {
  ele: T
  display: string

  static create<T extends ElementType>(tagName: string, attrs: Attrs = {}): T {
    let { className, ...restAttrs } = attrs
    let ele: T

    if (tagName === 'svg') {
      ;(ele as SVGSVGElement) = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg',
      )
    } else if (tagName === '#document-fragment') {
      ;(ele as DocumentFragment) = document.createDocumentFragment()
    } else {
      ;(ele as HTMLElement) = document.createElement(tagName)
    }
    if (!isFragment(ele)) {
      Ele.addClassName(ele, className)
      for (const key in restAttrs) {
        ele.setAttribute(key, restAttrs[key])
      }
    }
    return ele
  }

  static addClassName(
    ele: HTMLElement | SVGSVGElement,
    classList: string | string[],
  ) {
    if (!classList) return
    if (typeof classList === 'string') {
      classList = classList.split(' ')
    }
    ele.classList.add(...classList.filter(Boolean))
  }

  static from(node: ElementType | Ele): ElementType {
    return node instanceof Ele ? node.ele : node
  }

  constructor(element: T, attrs?: Attrs, children?: Ele | ElementType)
  constructor(tagName: string, attrs?: Attrs, children?: Ele | ElementType)
  constructor(tagName: string, attrs?: Attrs, children?: (Ele | ElementType)[])
  constructor(tagName: string | T, attrs?: Attrs, children?: any) {
    if (typeof tagName !== 'string') {
      this.ele = tagName
    } else {
      this.ele = Ele.create<T>(tagName, attrs)
    }
    if (!isFragment(this.ele)) {
      this.display =
        this.ele.style.display === 'none' ? 'initial' : this.ele.style.display
    }
    children && this.appendChild(children)
  }

  get classList(): DOMTokenList {
    return isFragment(this.ele) ? null : this.ele.classList
  }
  set innerHTML(content: string) {
    if (!isFragment(this.ele)) {
      this.ele.innerHTML = content
    }
  }
  set textContent(content: string) {
    this.ele.textContent = content
  }

  query(selectors: string): Element | null {
    return this.ele.querySelector(selectors)
  }
  queryAll(selectors: string): HTMLElement[] {
    return Array.from(this.ele.querySelectorAll(selectors))
  }
  remove() {
    this.ele.parentNode && this.ele.parentNode.removeChild(this.ele)
  }
  toggle(): void
  toggle(status: boolean): void
  toggle(status?: boolean | undefined): void {
    if (typeof status === 'boolean') {
      status ? this.show() : this.hide()
    } else {
      if (!isFragment(this.ele)) {
        this.ele.style.display === 'none' ? this.show() : this.hide()
      }
    }
  }
  show() {
    if (!isFragment(this.ele)) {
      this.ele.style.display = this.display
    }
  }
  hide() {
    if (!isFragment(this.ele)) {
      this.ele.style.display = 'none'
    }
  }
  appendChild(newChild: ElementType | Ele): ElementType
  appendChild(newChild: (ElementType | Ele)[]): ElementType[]
  appendChild(newChild: (ElementType | Ele)[] | ElementType | Ele) {
    return Array.isArray(newChild)
      ? newChild.map(child => this.appendChild(child))
      : this.ele.appendChild(Ele.from(newChild))
  }
  insertBefore(
    newChild: ElementType | Ele,
    refChild: ElementType | Ele,
  ): ElementType {
    return this.ele.insertBefore(Ele.from(newChild), Ele.from(refChild))
  }
  on(
    eventType: keyof HTMLElementEventMap,
    listener: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void {
    this.ele.addEventListener(eventType, listener, options)
  }
  off(
    eventType: keyof HTMLElementEventMap,
    listener: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void {
    this.ele.removeEventListener(eventType, listener, options)
  }
}

function isFragment(element: ElementType | Ele): element is DocumentFragment {
  return element instanceof DocumentFragment
}

export type Svg = {
  attributes: { [key: string]: string }
  content: string
}

export function svg(options: Svg, attrs: Attrs = {}): Ele<SVGSVGElement> {
  const svgEle = new Ele<SVGSVGElement>('svg', {
    ...options.attributes,
    ...attrs,
  })
  svgEle.innerHTML = options.content
  return svgEle
}
