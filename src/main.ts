import throttle from 'lodash.throttle'
import Ele from './core/ele'
import storage from './core/storage'
import lifeCircle from './core/life-circle'
import className from './config/class-name'
import { mdRender } from './core/markdown'
import { getHeads, CONTENT_TYPES, setPageTheme } from './shared'
import toggleIcon from './images/icon_toggle.svg'
import './style/index.less'

storage
  .get()
  .then(({ enable = true, refresh = true, pageTheme = 'light', mdPlugins }) => {
    chrome.runtime.onMessage.addListener(({ type, value }) => {
      switch (type) {
        case 'reload':
          if (mdSource) {
            contentRender(mdSource, {
              plugins: value,
            })
          } else {
            window.location.reload()
          }
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

    if (!enable || !CONTENT_TYPES.includes(document.contentType)) {
      return
    }

    let pollingTimer: number = null
    let mdSource: string = null

    // init page
    setPageTheme(pageTheme)
    const mdBody: Ele = new Ele('main', {
      className: className.MD_BODY,
    })
    const mdContent: Ele = new Ele('article', {
      className: className.MD_CONTENT,
    })

    // parse source
    const mdSourceEle = lifeCircle.getContainer()
    if (mdSourceEle) {
      mdSource = mdSourceEle.textContent
    }

    const mdRenderer = (target) => (code, options?) =>
      (target.innerHTML = mdRender(code, options))

    const contentRender = mdRenderer(mdContent)
    contentRender(mdSource, {
      plugins: mdPlugins,
    })
    mdBody.appendChild(mdContent)

    // render md side
    const mdSide = new Ele('ul', {
      className: className.MD_SIDE,
    })
    let headEleList: HTMLElement[] = getHeads(mdContent)
    const df = document.createDocumentFragment()
    const handleHeadItem = (eleList: HTMLElement[], headEle: HTMLElement) => {
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
    const sideLis: HTMLElement[] = headEleList.reduce(handleHeadItem, [])
    mdSide.ele.appendChild(df)

    let targetIndex: number = null
    const onScroll = () => {
      headEleList.some((_, index: number) => {
        let sectionHeight = -20
        if (headEleList[index + 1]) {
          sectionHeight += headEleList[index + 1].offsetTop
        }

        const hit =
          sectionHeight <= 0 ||
          sectionHeight > document.documentElement.scrollTop

        if (hit && targetIndex !== index) {
          sideLis[targetIndex] &&
            sideLis[targetIndex].classList.remove(className.MD_SIDE_ACTIVE)
          targetIndex = index
          sideLis[targetIndex] &&
            sideLis[targetIndex].classList.add(className.MD_SIDE_ACTIVE)
        }
        return hit
      })
    }
    document.addEventListener('scroll', throttle(onScroll, 200))
    setTimeout(onScroll, 0)

    // render md toggle
    const topBarEle = new Ele('div', {
      className: className.TOP_BAR_ELE,
    })
    const toggleBtn = new Ele('button', {
      className: className.TOGGLE_BTN,
      title: 'Toggle',
    })
    toggleBtn.addEventListener('click', () => {
      lifeCircle.modeChange([mdBody, mdSide])
    })

    const attrs = Object.keys(toggleIcon.attributes)
      .map((k) => `${k}="${toggleIcon.attributes[k]}"`)
      .join(' ')

    toggleBtn.innerHTML = `<svg ${attrs}>${toggleIcon.content}</svg>`
    topBarEle.appendChild(toggleBtn)

    // mount
    lifeCircle.mount([mdSide, mdBody, topBarEle])

    // auto refresh
    if (refresh) {
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
          (res) => {
            if (mdSource === null) {
              mdSource = res
            } else if (mdSource !== res) {
              mdSource = res
              contentRender(res)
            }
            pollingTimer = setTimeout(watch, 200)
          },
        )
      })()
    }
  })
