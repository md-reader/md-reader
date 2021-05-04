import hljs from 'highlight.js'
import markdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import throttle from 'lodash.throttle'
import { websites } from './config/website.json'
import Ele from './core'
import { HEAD, BODY, getAssetsURL } from './shared/index'
import './style/index.less'
import './style/theme/markdown-theme-juejin.less'
import './style/theme/hljs-theme-atom-one-dark.less'

interface WebsiteConfig {
  name: string
  rule: string
  disable: boolean
  container?: string
}

void (function () {
  const targetConfig: WebsiteConfig = websites.find((config: WebsiteConfig) =>
    new RegExp(config.rule).test(window.location.href),
  )
  if (targetConfig && targetConfig.disable) {
    return
  }

  const HEADERS = 'h1, h2, h3, h4, h5, h6'
  let SHOW_MD_SOURCE: boolean = true

  const cssSelector = (targetConfig && targetConfig.container) || 'pre'
  const mdSourceEle: HTMLElement = BODY.querySelector(cssSelector)
  const mdSource = mdSourceEle.textContent || 'No markdown here.'
  const mdSourceEleDisplay = mdSourceEle.style.display
  mdSourceEle.style.display = 'none'

  HEAD.appendChild(
    new Ele('link', {
      rel: 'icon',
      href: getAssetsURL('images/icon128.png'),
    }).ele,
  )

  // parse source
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    xhtmlOut: true,
    highlight(str: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs-pre"><code class="hljs" lang="${lang}">${
            hljs.highlight(lang, str, true).value
          }</code></pre>`
        } catch (err) {
          console.error(err)
          return 'parse error'
        }
      }
      return ''
    },
  })
  md.use(emoji)
  const mdHTML = md.render(mdSource)

  // render md body
  BODY.classList.toggle('md-reader')
  const mdBody = new Ele('div', {
    className: 'md-reader__body',
  })
  const mdContent = new Ele('article', {
    className: 'md-reader__markdown-content',
  })
  mdContent.ele.innerHTML = mdHTML
  mdBody.ele.appendChild(mdContent.ele)
  BODY.appendChild(mdBody.ele)

  // render md side
  const headEleList = mdContent.queryAll(HEADERS)
  const mdSide = new Ele('ul', {
    className: 'md-reader__side',
  })
  const sideLis: HTMLElement[] = []
  const handleHeadItem = (headEle: HTMLElement) => {
    const content = headEle.textContent
    headEle.setAttribute('id', content)

    const headAnchor = new Ele('a', {
      className: 'md-reader__head-anchor',
      href: `#${window.encodeURIComponent(content)}`,
    })
    headAnchor.ele.textContent = '#'
    headEle.insertBefore(headAnchor.ele, headEle.firstChild)

    const a = new Ele('a', {
      href: `#${window.encodeURIComponent(content)}`,
    })
    a.ele.textContent = content
    const li = new Ele('li', {
      className: `md-reader__side-${headEle.tagName.toLowerCase()}`,
    })
    sideLis.push(li.ele)
    li.ele.appendChild(a.ele)
    mdSide.ele.appendChild(li.ele)
  }
  headEleList.forEach(handleHeadItem)
  BODY.appendChild(mdSide.ele)

  const onScroll = () => {
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
        li.classList.add('md-reader__side-li--active')
      } else {
        li.classList.remove('md-reader__side-li--active')
      }
    })
  }
  onScroll()
  document.addEventListener('scroll', throttle(onScroll, 200))

  // render md toggle
  const topBarEle = new Ele('div', {
    className: 'md-reader__top',
  })
  const toggleBtn = new Ele('button', {
    className: 'md-reader__btn md-reader__btn--toggle',
    title: 'Toggle',
  })
  toggleBtn.addEventListener('click', toggleMode)
  topBarEle.ele.appendChild(toggleBtn.ele)
  BODY.appendChild(topBarEle.ele)

  function toggleMode() {
    SHOW_MD_SOURCE = !SHOW_MD_SOURCE
    BODY.classList.toggle('md-reader')
    mdBody.toggle(SHOW_MD_SOURCE)
    mdSide.toggle(SHOW_MD_SOURCE)
    mdSourceEle.style.display = SHOW_MD_SOURCE ? 'none' : mdSourceEleDisplay
  }
})()
