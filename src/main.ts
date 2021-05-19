import throttle from 'lodash.throttle'
import Ele from './core/ele'
import md from './core/markdown'
import lifeCircle from './core/life-circle'
import { getHeads, CONTENT_TYPES } from './shared/index'
import className from './config/class-name'
import './style/index.less'
import './style/theme/markdown-theme-juejin.less'
import './style/theme/hljs-theme-atom-one-dark.less'

void (() => {
  if (!~CONTENT_TYPES.indexOf(document.contentType)) {
    return
  }

  // init
  const mdSourceEle = lifeCircle.init()
  const mdSource = mdSourceEle.textContent || 'No markdown here.'

  // parse source
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
  const handleHeadItem = (eleList: HTMLElement[], headEle: HTMLElement) => {
    const content = headEle.textContent
    headEle.setAttribute('id', content)

    const headAnchor = new Ele('a', {
      className: className.HEAD_ANCHOR,
      href: `#${window.encodeURIComponent(content)}`,
    })
    headAnchor.textContent = '#'
    headEle.insertBefore(headAnchor.ele, headEle.firstChild)

    const a = new Ele('a', {
      href: `#${window.encodeURIComponent(content)}`,
    })
    a.textContent = content
    const li = new Ele('li', {
      className: `md-reader__side-${headEle.tagName.toLowerCase()}`,
    })
    eleList.push(li.ele)
    li.appendChild(a)
    mdSide.appendChild(li)

    return eleList
  }
  const sideLis: HTMLElement[] = headEleList.reduce(handleHeadItem, [])

  const onScroll = throttle(() => {
    let targetIndex
    headEleList.some((head: HTMLElement, index) => {
      const headOffsetHeight = head.offsetHeight
      const headOffsetTop = head.offsetTop
      let sectionHeight = headOffsetTop + headOffsetHeight

      if (headEleList[index + 1]) {
        sectionHeight +=
          headEleList[index + 1].offsetTop - headOffsetTop - headOffsetHeight
      }

      const hit = sectionHeight > document.documentElement.scrollTop + 15
      if (hit) {
        targetIndex = index
      }
      return hit
    })

    sideLis.forEach((li, index) => {
      if (index === targetIndex) {
        li.classList.add(className.MD_SIDE_ACTIVE)
      } else {
        li.classList.remove(className.MD_SIDE_ACTIVE)
      }
    })
  }, 200)
  onScroll()
  document.addEventListener('scroll', onScroll)

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
  topBarEle.appendChild(toggleBtn)

  // mount
  lifeCircle.mount([mdSide, mdBody, topBarEle])
})()
