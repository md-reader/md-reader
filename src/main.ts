import throttle from 'lodash.throttle'
import Ele from './core/ele'
import md from './core/markdown'
import lifeCircle from './core/life-circle'
import { getHeads, CONTENT_TYPES } from './shared/index'
import className from './config/class-name'
import toggleIcon from './images/icon_toggle.svg'
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
  const df = document.createDocumentFragment()
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
    df.appendChild(li.ele)

    return eleList
  }
  const sideLis: HTMLElement[] = headEleList.reduce(handleHeadItem, [])
  mdSide.ele.appendChild(df)

  let targetIndex: number = null
  const onScroll = () => {
    headEleList.some((head: HTMLElement, index: number) => {
      const { offsetHeight: headOffsetHeight, offsetTop: headOffsetTop } = head
      const documentScrollTop = document.documentElement.scrollTop
      let sectionHeight = headOffsetTop + headOffsetHeight

      if (headEleList[index + 1]) {
        sectionHeight +=
          headEleList[index + 1].offsetTop - headOffsetTop - headOffsetHeight
      }

      const posi = sectionHeight - 15
      const hit = posi < 0 ? true : posi > documentScrollTop

      if (hit) {
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
})()
