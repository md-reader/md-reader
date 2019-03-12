const utils = {
  createEle(tagName, classNameList = [], attrs = {}) {
    const ele = document.createElement(tagName)
    ele.classList.add(...classNameList)
    Object.keys(attrs).forEach(attr => ele.setAttribute(attr, attrs[attr]))
    return ele
  },

  getAssetsURL (path) {
    return chrome.extension.getURL(path)
  },

  addStyleToHead(href) {
    const linkEle = utils.createEle('link', [], {
      href,
      rel: 'stylesheet'
    })
    document.head.appendChild(linkEle)
    return linkEle
  },

  renderPage(ele, html) {
    ele.innerHTML = html
    document.body.appendChild(ele)
  }
}