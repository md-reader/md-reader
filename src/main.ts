import throttle from 'lodash.throttle'
import Event from '@/core/event'
import storage from '@/core/storage'
import Ele, { svg } from '@/core/ele'
import { initPlugins } from '@/plugins'
import lifecycle from '@/core/lifecycle'
import className from '@/config/class-name'
import type { Theme } from '@/config/page-themes'
import { getDefaultData, type Data } from '@/core/data'
import { mdRender, type MdOptions } from '@/core/markdown'
import {
  getDirectoryName,
  getParentDirectoryURL,
  isLocalDirectoryPage,
  renderFolderBrowser,
} from '@/core/folder'
import {
  getHeads,
  getRawContainer,
  setTheme,
  CONTENT_TYPES,
  darkMediaQuery,
  getMediaQueryTheme,
  toTheme,
} from '@/shared'
import codeIcon from '@/images/icon_code.svg'
import sideIcon from '@/images/icon_side.svg'
import goTopIcon from '@/images/icon_go_top.svg'
import '@/style/index.less'

function main(data: Data) {
  const configData = getDefaultData(data)
  const directoryPage = isLocalDirectoryPage()
  const localPage = window.location.protocol === 'file:'
  const directoryHTML = directoryPage
    ? document.documentElement.outerHTML
    : null
  const actions = {
    reload() {
      window.location.reload()
    },
    updateMdPlugins() {
      reloading = true
      if (mdRaw) {
        contentRender(mdRaw)
        renderSide()
      } else {
        window.location.reload()
      }
      reloading = false
    },
    updatePageTheme(theme: Theme, prevTheme: Theme) {
      setTheme(theme)
      renderContentByTheme(theme, prevTheme)
    },
    toggleRefresh(value) {
      clearTimeout(pollingTimer)
      value && !directoryPage && polling()
    },
    toggleCentered(value) {
      mdContent.classList.toggle('centered', value)
    },
    toggleSide() {
      onToggleSide()
    },
  }
  chrome.runtime.onMessage.addListener(({ action, data: { key, value } }) => {
    const oldValue = configData[key]
    configData[key] = value
    actions[action]?.(value, oldValue)
  })

  if (
    !configData.enable ||
    (!directoryPage && !CONTENT_TYPES.includes(document.contentType))
  ) {
    return
  }

  let pollingTimer: number = null
  let reloading: boolean = false
  let mdRaw: string = null
  let isSideHover: boolean = false
  let globalEvent: Event = new Event()

  initPlugins({ event: globalEvent })

  /* init md page */
  setTheme(configData.pageTheme)
  document.body.classList.toggle(
    className.SIDE_COLLAPSED,
    configData.hiddenSide,
  )

  const rawContainer = directoryPage ? null : getRawContainer()
  if (directoryPage) {
    document.body.replaceChildren()
  }
  lifecycle.init(rawContainer)
  mdRaw = directoryPage
    ? `# 📁 ${escapeMarkdown(
        getDirectoryName(window.location.href),
      )}\n\n从左侧文件夹目录选择 Markdown 文件。`
    : rawContainer?.textContent

  /* render content */
  const mdContent = new Ele<HTMLElement>('article', {
    className: `${className.MD_CONTENT} ${
      configData.centered ? 'centered' : ''
    }`,
  })

  const mdRenderer =
    (target: HTMLElement | Ele) =>
    (code: string = '', options?: MdOptions) => {
      target.innerHTML = mdRender(code, {
        theme: toTheme(configData.pageTheme),
        plugins: configData.mdPlugins,
        ...options,
      })
      const ele = target instanceof Ele ? target.ele : target
      document.title = ele.querySelector('h1')?.textContent.trim() ?? ''
      globalEvent.emit(
        'contentRendered',
        target instanceof Ele ? target.ele : target,
      )
    }
  const contentRender = mdRenderer(mdContent)
  contentRender(mdRaw)

  mdContent.on(
    'click',
    async e => {
      globalEvent.emit('click', e.target)
    },
    true,
  )

  const mdBody = new Ele<HTMLElement>(
    'main',
    { className: className.MD_BODY },
    mdContent,
  )

  /* render side */
  const mdOutline = new Ele<HTMLElement>('ul', {
    className: className.MD_OUTLINE,
  })
  const mdSide = new Ele<HTMLElement>('aside', {
    className: className.MD_SIDE,
  })
  if (localPage) {
    const folderBrowser = new Ele<HTMLElement>('nav', {
      className: className.FOLDER_BROWSER,
    })
    const folderResizer = new Ele<HTMLElement>('div', {
      className: className.FOLDER_RESIZER,
      role: 'separator',
      tabindex: '0',
      title: '拖动调整文件夹与目录高度；双击恢复默认',
      'aria-label': '调整文件夹与目录高度',
      'aria-orientation': 'horizontal',
    })
    mdSide.append([folderBrowser, folderResizer])
    setupFolderPaneResize(
      mdSide.ele,
      folderBrowser.ele,
      folderResizer.ele,
      configData.folderPaneRatio,
      ratio => {
        configData.folderPaneRatio = ratio
        void storage.set('folderPaneRatio', ratio)
      },
    )
    const rootURL = directoryPage
      ? window.location.href
      : getParentDirectoryURL(window.location.href)
    void renderFolderBrowser({
      container: folderBrowser.ele,
      rootURL,
      currentURL: directoryPage ? undefined : window.location.href,
      initialHTML: directoryPage ? directoryHTML : undefined,
    })
  }
  mdSide.append(mdOutline)
  let idCache: { [content: string]: number } = Object.create(null)
  let headElements: HTMLElement[] = []
  let sideLiElements: HTMLElement[] = []
  let df: Ele<DocumentFragment> = null
  let targetIndex: number = null
  mdSide.on('mouseenter', () => {
    isSideHover = true
  })
  mdSide.on('mouseleave', () => {
    isSideHover = false
  })

  renderSide()
  document.addEventListener('scroll', throttle(onScroll, 100))

  /* render raw toggle button */
  const rawToggleBtn = directoryPage
    ? null
    : new Ele<HTMLElement>(
        'button',
        {
          className: [className.MD_BUTTON, className.CODE_TOGGLE_BTN],
          title: 'Toggle raw',
        },
        svg(codeIcon),
      )
  rawToggleBtn?.on('click', () => {
    lifecycle.toggleRaw([mdBody, mdSide])
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
    chrome.runtime.sendMessage({
      action: 'storage',
      data: {
        key: 'hiddenSide',
        value: !configData.hiddenSide,
      },
    })
  })
  function onToggleSide() {
    if (window.innerWidth <= 960) {
      const value = document.body.classList.toggle(className.SIDE_EXPANDED)
      mdBody.off('click', foldSide, true)
      window.removeEventListener('resize', foldSide)
      document.removeEventListener('keydown', foldSide)
      if (value) {
        setTimeout(() => {
          mdBody.on('click', foldSide, { capture: true, once: true })
          window.addEventListener('resize', foldSide, { once: true })
          document.addEventListener('keydown', foldSide, { once: true })
        }, 0)
      }
    } else {
      configData.hiddenSide = document.body.classList.toggle(
        className.SIDE_COLLAPSED,
      )
    }
  }
  function foldSide(e: UIEvent) {
    if (e.type === 'keydown' && (e as KeyboardEvent).code !== 'Escape') {
      return
    }
    document.body.classList.remove(className.SIDE_EXPANDED)
    mdBody.off('click', foldSide, true)
    window.removeEventListener('resize', foldSide)
    document.removeEventListener('keydown', foldSide)
    e.stopPropagation()
    e.preventDefault()
    return false
  }
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
    [sideExpandBtn, rawToggleBtn, goTopBtn].filter(Boolean),
  )

  /* mount elements */
  lifecycle.mount([buttonWrap, mdBody, mdSide])
  updateAnchorPosition()

  darkMediaQuery.addEventListener('change', (e: MediaQueryListEvent) => {
    if (configData.pageTheme === 'auto') {
      renderContentByTheme(
        e.matches ? 'light' : 'dark',
        e.matches ? 'dark' : 'light',
      )
    }
  })

  /* auto refresh */
  if (configData.refresh && !directoryPage) {
    polling()
  }

  function polling() {
    void (function watch() {
      clearTimeout(pollingTimer)
      chrome.runtime.sendMessage({ action: 'fetch' }, res => {
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
            /* update raw content */
            setTimeout(() => {
              rawContainer.textContent = res
            }, 0)
          }
        }
        pollingTimer = setTimeout(watch, 500)
      })
    })()
  }

  function renderSide() {
    idCache = Object.create(null)
    headElements = getHeads(mdContent)
    df = new Ele<DocumentFragment>('#document-fragment')
    sideLiElements = headElements.reduce(handleHeadItem, [])
    mdOutline.innerHTML = null
    mdOutline.append(df)
    setTimeout(onScroll, 0)
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
      className: `${className.MD_SIDE}-${head.tagName.toLowerCase()}`,
    })
    eleList.push(li.ele)
    li.append(link)
    df.append(li.ele)

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
          if (!isSideHover && target.scrollIntoView) {
            target.scrollIntoView({ block: 'nearest' })
          }
        }
      }
      return hit
    })
  }

  function renderContentByTheme(theme: Theme, prevTheme: Theme) {
    if (configData.mdPlugins.includes('Mermaid')) {
      if (theme === 'auto' || prevTheme === 'auto') {
        const themeScheme = getMediaQueryTheme()
        if (theme !== themeScheme && prevTheme !== themeScheme) {
          contentRender(mdRaw)
          renderSide()
        }
      } else {
        contentRender(mdRaw)
        renderSide()
      }
    }
  }

  function updateAnchorPosition() {
    if (window.location.hash) {
      setTimeout(() => {
        const hash = window.location.hash.slice(1)
        const target = headElements.find(head => {
          return head.getAttribute('id') === hash
        })
        if (target) {
          const top = target.offsetTop
          top && window.scrollTo(0, top)
        }
      })
    }
  }
}

function escapeMarkdown(value: string): string {
  return value.replace(/([\\`*_{}\[\]()<>#+\-.!|])/g, '\\$1')
}

const DEFAULT_FOLDER_PANE_RATIO = 0.42
const MIN_FOLDER_PANE_RATIO = 0.15
const MAX_FOLDER_PANE_RATIO = 0.8
const MIN_PANE_HEIGHT = 96

function setupFolderPaneResize(
  side: HTMLElement,
  folder: HTMLElement,
  resizer: HTMLElement,
  initialRatio: number,
  onChange: (ratio: number) => void,
) {
  let ratio = clampFolderPaneRatio(initialRatio)
  let dragging = false

  const applyRatio = (value: number) => {
    ratio = clampFolderPaneRatio(value)
    folder.style.flexBasis = `${ratio * 100}%`
    resizer.setAttribute('aria-valuenow', String(Math.round(ratio * 100)))
  }

  const getLayout = () => {
    const style = getComputedStyle(side)
    const paddingTop = Number.parseFloat(style.paddingTop) || 0
    const paddingBottom = Number.parseFloat(style.paddingBottom) || 0
    const availableHeight = Math.max(
      1,
      side.clientHeight - paddingTop - paddingBottom - resizer.offsetHeight,
    )
    const minHeight = Math.min(MIN_PANE_HEIGHT, availableHeight / 2)
    return {
      availableHeight,
      minHeight,
      top: side.getBoundingClientRect().top + paddingTop,
    }
  }

  const applyHeight = (height: number) => {
    const { availableHeight, minHeight } = getLayout()
    const nextHeight = Math.min(
      Math.max(height, minHeight),
      availableHeight - minHeight,
    )
    ratio = clampFolderPaneRatio(nextHeight / availableHeight)
    folder.style.flexBasis = `${nextHeight}px`
    resizer.setAttribute('aria-valuenow', String(Math.round(ratio * 100)))
  }

  const finishResize = () => {
    if (!dragging) return
    dragging = false
    document.body.classList.remove(className.SIDE_RESIZING)
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', finishResize)
    document.removeEventListener('pointercancel', finishResize)
    applyRatio(ratio)
    onChange(ratio)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return
    applyHeight(event.clientY - getLayout().top)
  }

  resizer.addEventListener('pointerdown', (event: PointerEvent) => {
    if (event.button !== 0) return
    event.preventDefault()
    dragging = true
    document.body.classList.add(className.SIDE_RESIZING)
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', finishResize)
    document.addEventListener('pointercancel', finishResize)
  })
  resizer.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    const delta = event.key === 'ArrowUp' ? -24 : 24
    applyHeight(folder.getBoundingClientRect().height + delta)
    applyRatio(ratio)
    onChange(ratio)
  })
  resizer.addEventListener('dblclick', () => {
    applyRatio(DEFAULT_FOLDER_PANE_RATIO)
    onChange(ratio)
  })

  resizer.setAttribute(
    'aria-valuemin',
    String(Math.round(MIN_FOLDER_PANE_RATIO * 100)),
  )
  resizer.setAttribute(
    'aria-valuemax',
    String(Math.round(MAX_FOLDER_PANE_RATIO * 100)),
  )
  applyRatio(ratio)
}

function clampFolderPaneRatio(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_FOLDER_PANE_RATIO
  return Math.min(Math.max(value, MIN_FOLDER_PANE_RATIO), MAX_FOLDER_PANE_RATIO)
}

storage.get().then(main)
