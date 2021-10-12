import throttle from 'lodash.throttle'
import Ele from './core/ele'
import initMd from './core/markdown'
import storage from './core/storage'
import lifeCircle from './core/life-circle'
import { getHeads, CONTENT_TYPES } from './shared/index'
import className from './config/class-name'
import toggleIcon from './images/icon_toggle.svg'
import MD_PLUGINS from './config/md-plugins'
import './style/index.less'

void (async () => {
  const {
    enable = true,
    refresh = true,
    pageTheme = 'light',
    mdPlugins = [...MD_PLUGINS],
  } = await storage.get()

  if (!enable || !CONTENT_TYPES.includes(document.contentType)) {
    return
  }

  // init
  const mdSourceEle = lifeCircle.init({
    pageTheme,
  })
  let mdSource = ''
  if (mdSourceEle) {
    mdSource = mdSourceEle.textContent
  }

  // parse source
  const md = initMd({ plugins: mdPlugins })
  const mdHTML = md.render(mdSource)

  // render md body
  const mdBody = new Ele('div', {
    className: className.MD_BODY,
  })
  const mdContent = new Ele('article', {
    className: className.MD_CONTENT,
  })
  mdContent.innerHTML = mdHTML
  mdBody.appendChild(mdContent)

  // render md side
  const headEleList: HTMLElement[] = getHeads(mdContent)
  const mdSide = new Ele('ul', {
    className: className.MD_SIDE,
  })
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
        sectionHeight <= 0 || sectionHeight > document.documentElement.scrollTop

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
  onScroll()
  document.addEventListener('scroll', throttle(onScroll, 200))

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
    let resource = null
    let timer = null

    void (function watch() {
      clearTimeout(timer)
      chrome.runtime.sendMessage(
        {
          type: 'tryReload',
          value: window.location.href,
        },
        (res) => {
          if (resource === null) {
            resource = res
          } else if (resource !== res) {
            return window.location.reload()
          }
          timer = setTimeout(watch, 200)
        },
      )
    })()
  }
})()
