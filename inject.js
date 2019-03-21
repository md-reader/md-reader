const { addStyleToHead, createEle, renderPage, getAssetsURL } = utils
const DEFAULT_CSS_STYLE_URL = 'css/md-css-github.css'

const codeEle = document.body.firstElementChild
const code = codeEle.textContent
codeEle.style.display = 'none'

addStyleToHead(DEFAULT_CSS_STYLE_URL)
addStyleToHead('css/hljs-style-atom-one-dark.css')
addStyleToHead('css/index.css')

document.head.appendChild(createEle('meta', [], {charset: "UTF-8"}))
document.head.appendChild(createEle('link', [], {
  rel: "shortcut icon",
  href: getAssetsURL("images/icon128.png")
}))

const md = markdownit({
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs-pre"><code class="hljs" lang="${lang}">${hljs.highlight(lang, str, true).value}</code></pre>`;
      } catch (__) {}
    }
    return '';
  }
})
const articleEle = createEle('article', ['markdown-body'])
renderPage(articleEle, md.render(code))


const headList = [...document.querySelectorAll('h1, h2, h3, h4')]
const nav = document.createElement('ul')
nav.classList.add('nav-wrap')

const handleNavItem = (ele, i) => {
  const content = ele.textContent
  ele.id = content

  const a = document.createElement('a')
  a.setAttribute('href', `#${content}`)
  a.dataset.id = i
  a.textContent = content
  const li = document.createElement('li')
  li.classList.add(ele.tagName.toLowerCase())
  li.appendChild(a)
  nav.appendChild(li)
}

headList.forEach(handleNavItem)

document.body.insertBefore(nav, document.body.firstElementChild)