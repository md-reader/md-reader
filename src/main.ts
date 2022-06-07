import throttle from 'lodash.throttle'
import events from './core/events'
import storage from './core/storage'
import Ele, { svg } from './core/ele'
import className from './config/class-name'
import { getDefaultData, type Data } from './core/data'
import { mdRender, type MdOptions } from './core/markdown'
import {
  getHeads,
  getRawContainer,
  setTheme,
  writeText,
  CONTENT_TYPES,
} from './shared'
import codeIcon from './images/icon_code.svg'
import sideIcon from './images/icon_side.svg'
import goTopIcon from './images/icon_go_top.svg'
import './style/index.less'

function main(data: Data) {
  const configData = getDefaultData(data)
  const actions = {
    reload() {
      window.location.reload()
    },
    updateMdPlugins(value) {
      reloading = true
      if (mdRaw) {
        contentRender(mdRaw, {
          plugins: value,
        })
        renderSide()
        onScroll()
      } else {
        window.location.reload()
      }
      reloading = false
    },
    updatePageTheme(value) {
      setTheme(value)
    },
    switchRefresh(value) {
      clearTimeout(pollingTimer)
      value && polling()
    },
    switchCentered(value) {
      mdContent.classList.toggle('centered', value)
    },
  }
  chrome.runtime.onMessage.addListener(({ type, key, value }) => {
    configData[key] = value
    const handler = actions[type]
    handler && handler(value)
  })

  if (!configData.enable || !CONTENT_TYPES.includes(document.contentType)) {
    return
  }

  let pollingTimer: number = null
  let reloading: boolean = false
  let mdRaw: string = null

  /* init md page */
  setTheme(configData.pageTheme)

  const rawContainer = getRawContainer()
  events.init(rawContainer)
  mdRaw = rawContainer?.textContent

  /* render content */
  const mdContent = new Ele<HTMLElement>('article', {
    className: `${className.MD_CONTENT} ${
      configData.centered ? 'centered' : ''
    }`,
  })

  const mdRenderer =
    (target: HTMLElement | Ele) =>
    (code: string = '', options?: MdOptions) =>
      (target.innerHTML = mdRender(code, options))
  const contentRender = mdRenderer(mdContent)
  contentRender(mdRaw, { plugins: configData.mdPlugins })

  // code block copy button event
  mdContent.on(
    'click',
    async e => {
      const button = e.target as HTMLElement
      if (button.classList.contains(className.COPY_BTN)) {
        const codeEle = button.parentNode.querySelector('code.hljs')
        if (codeEle && !button.classList.contains('copied')) {
          await writeText(codeEle.textContent)
          button.classList.add('copied')
          setTimeout(() => button.classList.remove('copied'), 1000)
        }
      }
    },
    true,
  )

  const mdBody = new Ele<HTMLElement>(
    'main',
    { className: className.MD_BODY },
    mdContent,
  )

  /* render side */
  const mdSide = new Ele<HTMLElement>('ul', { className: className.MD_SIDE })
  let idCache: { [content: string]: number } = Object.create(null)
  let headElements: HTMLElement[] = []
  let sideLiElements: HTMLElement[] = []
  let df: Ele<DocumentFragment> = null
  let targetIndex: number = null

  renderSide()
  setTimeout(onScroll, 0)
  document.addEventListener('scroll', throttle(onScroll, 100))

  /* render raw toggle button */
  const rawToggleBtn = new Ele<HTMLElement>(
    'button',
    {
      className: [className.MD_BUTTON, className.CODE_TOGGLE_BTN],
      title: 'Toggle raw',
    },
    svg(codeIcon),
  )
  rawToggleBtn.on('click', () => {
    events.toggleRaw([mdBody, mdSide])
  })

  /* render side expand button */
  const sideExpandBtn = new Ele<HTMLElement>(
    'button',
    {
      className: [className.MD_BUTTON, className.SIDE_EXPAND_BTN],
      title: 'Expand side',
    },
    svg(sideIcon),
  )
  sideExpandBtn.on('click', () => {
    document.body.classList.add('sidebar-expanded')
    function foldSide(e) {
      if (e.type === 'keydown' && e.code !== 'Escape') {
        return
      }
      document.body.classList.remove('sidebar-expanded')
      mdBody.off('click', foldSide)
      window.removeEventListener('resize', foldSide)
      document.removeEventListener('keydown', foldSide)
    }
    setTimeout(() => {
      mdBody.on('click', foldSide)
      window.addEventListener('resize', foldSide)
      document.addEventListener('keydown', foldSide)
    }, 0)
  })
  /* render go top button */
  const goTopBtn = new Ele<HTMLElement>(
    'button',
    {
      className: [className.MD_BUTTON, className.GO_TOP_BTN],
      title: 'Go top',
    },
    svg(goTopIcon),
  )
  goTopBtn.hide()
  goTopBtn.on('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))

  const buttonWrap = new Ele<HTMLElement>(
    'div',
    { className: className.BUTTON_WRAP_ELE },
    [sideExpandBtn, rawToggleBtn, goTopBtn],
  )

  /* mount elements */
  events.mount([buttonWrap, mdBody, mdSide])

  /* auto refresh */
  if (configData.refresh) {
    polling()
  }

  function polling() {
    void (function watch() {
      clearTimeout(pollingTimer)
      chrome.runtime.sendMessage(
        {
          type: 'fetch',
          value: window.location.href,
        },
        res => {
          if (res !== undefined) {
            if (mdRaw === undefined || mdRaw === null) {
              if (res) {
                window.location.reload()
                return
              }
            } else if (mdRaw !== res) {
              mdRaw = res
              contentRender(res)
              renderSide()
              onScroll()
              /* update raw content */
              setTimeout(() => {
                rawContainer.textContent = res
              }, 0)
            }
          }
          pollingTimer = setTimeout(watch, 500)
        },
      )
    })()
  }

  function renderSide() {
    idCache = Object.create(null)
    headElements = getHeads(mdContent)
    df = new Ele<DocumentFragment>('#document-fragment')
    sideLiElements = headElements.reduce(handleHeadItem, [])
    mdSide.innerHTML = null
    mdSide.appendChild(df)
  }

  function handleHeadItem(
    eleList: HTMLElement[],
    head: HTMLElement,
  ): HTMLElement[] {
    const content = String(head.textContent).trim()
    const encodeContent = getDecodeContent(content)

    head.setAttribute('id', encodeContent)

    const headAnchor = new Ele<HTMLElement>('a', {
      className: className.HEAD_ANCHOR,
      href: `#${encodeContent}`,
    })
    headAnchor.textContent = '#'
    head.insertBefore(headAnchor.ele, head.firstChild)

    const link = new Ele<HTMLElement>('a', {
      title: content,
      href: `#${encodeContent}`,
    })
    link.textContent = content
    const li = new Ele<HTMLElement>('li', {
      className: `md-reader__side-${head.tagName.toLowerCase()}`,
    })
    eleList.push(li.ele)
    li.appendChild(link)
    df.appendChild(li.ele)

    return eleList
  }

  function getDecodeContent(content: string): string {
    return (function unique(key: string): string {
      if (key in idCache) {
        return unique(`${key}-${idCache[key]++}`)
      } else {
        idCache[key] = 1
        return key
      }
    })(encodeURIComponent(content.toLowerCase().replace(/\s+/g, '-')))
  }

  function onScroll() {
    const documentScrollTop = document.documentElement.scrollTop
    goTopBtn.toggle(documentScrollTop >= 640)

    headElements.some((_, index) => {
      let sectionHeight = -20
      const item = headElements[index + 1]
      if (item) {
        sectionHeight += item.offsetTop
      }

      const hit = sectionHeight <= 0 || sectionHeight > documentScrollTop

      if (hit && (targetIndex !== index || reloading)) {
        let target = sideLiElements[targetIndex]
        target && target.classList.remove(className.MD_SIDE_ACTIVE)

        target = sideLiElements[(targetIndex = index)]
        if (target) {
          target.classList.add(className.MD_SIDE_ACTIVE)
          if (target.scrollIntoView) {
            target.scrollIntoView({ block: 'nearest' })
          }
        }
      }
      return hit
    })
  }
}

storage.get().then(main)
