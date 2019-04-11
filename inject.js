const {
  injectStyle,
  createEle,
  renderPage,
  getAssetsURL,
  anchorTo
} = utils
const DEFAULT_MD_CSS_URL = 'css/md-css-github.css'

const mdCodeEle = BODY.firstElementChild
const mdCode = mdCodeEle.textContent
mdCodeEle.style.display = 'none'

// inject styles
void[
  DEFAULT_MD_CSS_URL,
  'css/hljs-style-atom-one-dark.css',
  'css/index.css',
].forEach(injectStyle)

HEAD.appendChild(createEle('meta', {charset: "UTF-8"}))
HEAD.appendChild(createEle('link', {
  rel: "shortcut icon",
  href: getAssetsURL("images/icon128.png")
}))

// render code to markdown
const md = markdownit({
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs-pre"><code class="hljs" lang="${lang}">${hljs.highlight(lang, str, true).value}</code></pre>`
      } catch (_) {}
    }
    return ''
  }
})
const articleEle = createEle('article', {
  className: ['markdown-body']
})
renderPage(articleEle, md.render(mdCode))

// render sidebar
const headList = [...document.querySelectorAll('h1, h2, h3, h4')]
const sidebar = createEle('ul', {
  className: 'sidebar-wrap'
})

const handleNavItem = (ele, i) => {
  const content = ele.textContent
  ele.id = content
  ele.onclick = () => anchorTo(content)

  const a = createEle('a', {
    href: `#${content}`,
    'data-id': i,
  })
  a.textContent = content

  const li = createEle('li', {
    className: ele.tagName.toLowerCase()
  })
  li.appendChild(a)
  sidebar.appendChild(li)
}
headList.forEach(handleNavItem)

BODY.insertBefore(sidebar, BODY.firstElementChild)
