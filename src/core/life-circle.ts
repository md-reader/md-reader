import Ele from './ele'
import { BODY, HEAD, getAssetsURL, getEle, SOURCE_SELECTOR } from '../shared'

const headTags = [
  {
    tag: 'link',
    attrs: {
      rel: 'icon',
      href: getAssetsURL('images/icon128.png'),
    },
  },
]

let isShowMDSource: boolean = true
let mdSourceEle: HTMLElement = null
let mdSourceEleDisplay: string = ''

export default {
  init({ pageTheme, codeTheme }) {
    BODY.classList.add(`page-theme--${pageTheme}`)
    BODY.classList.add(`code-theme--${codeTheme}`)
    mdSourceEle = BODY.querySelector(SOURCE_SELECTOR)
    mdSourceEleDisplay = mdSourceEle.style.display
    mdSourceEle.style.display = 'none'

    headTags.forEach((el) => HEAD.appendChild(new Ele(el.tag, el.attrs).ele))
    BODY.classList.add('md-reader')

    return mdSourceEle
  },
  mount(nodes: Array<HTMLElement | Ele>) {
    nodes.forEach((node) => BODY.appendChild(getEle(node)))
  },
  modeChange(eles: Array<Ele>) {
    isShowMDSource = !isShowMDSource

    BODY.classList.toggle('md-reader')
    eles.forEach((ele) => ele.toggle(isShowMDSource))

    mdSourceEle.style.display = isShowMDSource ? 'none' : mdSourceEleDisplay
  },
}
