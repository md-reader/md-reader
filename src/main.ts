import throttle from 'lodash.throttle'
import Ele from './core/ele'
import storage from './core/storage'
import events from './core/events'
import className from './config/class-name'
import { mdRender } from './core/markdown'
import { getHeads, CONTENT_TYPES, setPageTheme } from './shared'
import toggleIcon from './images/icon_toggle.svg'
import './style/index.less'
import Data, { getDefaultData } from './core/data'

function main(_data) {
  let data: Data = getDefaultData()
  Object.assign(data, _data)

  chrome.runtime.onMessage.addListener(({ type, value }) => {
    switch (type) {
      case 'reload':
        data.enable = value
        window.location.reload()
        break
      case 'updateMdPlugins':
        reloading = true
        if (mdSource) {
          contentRender(mdSource, {
            plugins: value,
          })
          renderSide()
          onScroll()
        } else {
          window.location.reload()
        }
        reloading = false
        break
      case 'updatePageTheme':
        setPageTheme(value)
        break
      case 'toggleRefresh':
        clearTimeout(pollingTimer)
        value && polling()
        break
    }
  })

  if (!data.enable || !CONTENT_TYPES.includes(document.contentType)) {
    return
  }

  let pollingTimer: number = null
  let reloading: boolean = false
  let mdSource: string = null

  // init page
  setPageTheme(data.pageTheme)
  const mdBody: Ele = new Ele('main', {
    className: className.MD_BODY,
  })
  const mdContent: Ele = new Ele('article', {
    className: className.MD_CONTENT,
  })

  // parse source
  const mdSourceEle = events.getContainer()
  if (mdSourceEle) {
    mdSource = mdSourceEle.textContent
  }

  const mdRenderer = target => (code, options?) =>
    (target.innerHTML = mdRender(code, options))

  const contentRender = mdRenderer(mdContent)
  contentRender(mdSource, {
    plugins: data.mdPlugins,
  })
  mdBody.appendChild(mdContent)

  // render md side
  const mdSide = new Ele('ul', {
    className: className.MD_SIDE,
  })
  let headEleList: HTMLElement[] = []
  let sideLis: HTMLElement[] = []
  let df: DocumentFragment = null
  let targetIndex: number = null

  renderSide()
  setTimeout(onScroll, 0)
  document.addEventListener('scroll', throttle(onScroll, 100))

  // render md toggle button
  const topBarEle = new Ele('div', {
    className: className.TOP_BAR_ELE,
  })
  const toggleBtn = new Ele('button', {
    className: className.TOGGLE_BTN,
    title: 'Toggle',
  })
  toggleBtn.addEventListener('click', () => {
    events.modeChange([mdBody, mdSide])
  })

  const attrs = Object.keys(toggleIcon.attributes)
    .map(k => `${k}="${toggleIcon.attributes[k]}"`)
    .join(' ')

  toggleBtn.innerHTML = `<svg ${attrs}>${toggleIcon.content}</svg>`
  topBarEle.appendChild(toggleBtn)

  // mount
  events.mount([mdSide, mdBody, topBarEle])

  // auto refresh
  if (data.refresh) {
    polling()
  }

  function polling() {
    void (function watch() {
      clearTimeout(pollingTimer)
      chrome.runtime.sendMessage(
        {
          type: 'tryReload',
          value: window.location.href,
        },
        res => {
          if (res !== undefined) {
            if (mdSource === null) {
              mdSource = res
            } else if (mdSource !== res) {
              mdSource = res
              contentRender(res)
              renderSide()
              onScroll()
            }
          }
          pollingTimer = setTimeout(watch, 500)
        },
      )
    })()
  }

  function handleHeadItem(eleList: HTMLElement[], headEle: HTMLElement) {
    const content = String(headEle.textContent).trim()

    const encodeContent = window.encodeURIComponent(
      content.toLowerCase().replace(/\s+/g, '-'),
    )

    headEle.setAttribute('id', encodeContent)

    const headAnchor = new Ele('a', {
      className: className.HEAD_ANCHOR,
      href: `#${encodeContent}`,
    })
    headAnchor.textContent = '#'
    headEle.insertBefore(headAnchor.ele, headEle.firstChild)

    const a = new Ele('a', {
      title: content,
      href: `#${encodeContent}`,
    })
    a.textContent = content
    const li = new Ele('li', {
      className: `md-reader__side-${headEle.tagName.toLowerCase()}`,
    })
    eleList.push(li.ele)
    li.appendChild(a)
    df.appendChild(li.ele)

    return eleList
  }

  function renderSide() {
    headEleList = getHeads(mdContent)
    df = document.createDocumentFragment()
    sideLis = headEleList.reduce(handleHeadItem, [])
    mdSide.innerHTML = null
    mdSide.appendChild(df)
  }

  function onScroll() {
    const documentScrollTop = document.documentElement.scrollTop
    headEleList.some((_, index) => {
      let sectionHeight = -20
      const item = headEleList[index + 1]
      if (item) {
        sectionHeight += item.offsetTop
      }

      const hit = sectionHeight <= 0 || sectionHeight > documentScrollTop

      if (hit && (targetIndex !== index || reloading)) {
        let target = sideLis[targetIndex]
        target && target.classList.remove(className.MD_SIDE_ACTIVE)

        target = sideLis[(targetIndex = index)]
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
