import hljs from 'highlight.js'
import markdownIt from 'markdown-it'
import './style/index.less'
import './style/btn.less'
import './style/hljs-style-atom-one-dark.css'
import './style/md-css-juejin.css'

import {
  BODY,
  HEAD,
  injectStyle,
  createEle,
  renderPage,
  getAssetsURL,
  anchorTo,
} from './utils/index'

const DEFAULT_MD_CSS_URL = 'css/md-css-github.css'
let SHOW_CODE = false

const mdCodeEle: HTMLElement = BODY.firstElementChild as HTMLElement
const mdCode = mdCodeEle.textContent || 'No content here.'
mdCodeEle.classList.add('md-code-wrap')
mdCodeEle.style.display = 'none'

// inject styles
// void [
//   DEFAULT_MD_CSS_URL,
//   'css/hljs-style-atom-one-dark.css',
//   'css/index.css',
//   'css/btn.css',
// ].forEach(injectStyle)

HEAD.appendChild(
  createEle('meta', {
    charset: 'UTF-8',
  })
)

if (HEAD.querySelector("link[rel=icon]")) {

}

HEAD.appendChild(
  createEle('link', {
    rel: 'shortcut icon',
    href: getAssetsURL('images/icon128.png'),
  })
)

// render code to markdown
const md = markdownIt({
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs-pre"><code class="hljs" lang="${lang}">${
          hljs.highlight(lang, str, true).value
        }</code></pre>`
      } catch (_) {}
    }
    return ''
  },
})
const articleEle = createEle('article', {
  className: ['markdown-body'],
})
renderPage(articleEle, md.render(mdCode))

// render sidebar
const headList = Array.from(document.querySelectorAll('h1, h2, h3, h4'))
const sidebar = createEle('ul', {
  className: 'sidebar-wrap',
})

const handleNavItem = (ele: Element, i: number) => {
  const content = ele.textContent!
  ele.setAttribute('id', content)
  ele.addEventListener('click', () => anchorTo(content))

  const a = createEle('a', {
    href: `#${content}`,
    'data-id': i,
  })
  a.textContent = content

  const li = createEle('li', {
    className: ele.tagName.toLowerCase(),
  })
  li.appendChild(a)
  sidebar.appendChild(li)
}
headList.forEach(handleNavItem)

BODY.insertBefore(sidebar, BODY.firstElementChild)

// toggle code
const topBarEle = createEle('div', {
  className: 'top-bar',
})
const btn = createEle('button', {
  className: 'btn edit-btn',
  title: '编辑',
})

const editBtn = btn.cloneNode()
editBtn.addEventListener('click', toggleMode)
topBarEle.appendChild(editBtn)
BODY.insertBefore(topBarEle, BODY.firstElementChild)

function toggleMode() {
  SHOW_CODE = !SHOW_CODE
  articleEle.style.display = sidebar.style.display = SHOW_CODE ? 'none' : ''
  mdCodeEle.style.display = SHOW_CODE ? '' : 'none'
}
