const HEAD = document.head
const BODY = document.body
const __anchor__ = document.createElement('a')

const utils = {
  createEle(tagName, attrs = {}) {
    let {
      className = [],
      ...restAttrs
    } = attrs

    const ele = document.createElement(tagName)
    if (typeof className === 'string' || className instanceof Array) {
      typeof className === 'string' && (className = className.split(' '))
      utils.addClasName(ele, className)
    }
    Object.keys(restAttrs).forEach(attr => ele.setAttribute(attr, attrs[attr]))
    return ele
  },

  addClasName(ele, classList) {
    classList = classList.filter(Boolean)
    ele.classList.add(...classList)
  },

  getAssetsURL(path) {
    return chrome.extension.getURL(path)
  },

  injectStyle(url) {
    const linkEle = utils.createEle('link', {
      href: utils.getAssetsURL(url),
      rel: 'stylesheet'
    })
    HEAD.appendChild(linkEle)
    return linkEle
  },

  anchorTo(id) {
    __anchor__.href = `#${id}`
    __anchor__.click()
  },

  renderPage(ele, html) {
    ele.innerHTML = html
    BODY.appendChild(ele)
  }
}