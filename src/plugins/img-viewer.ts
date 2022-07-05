import debounce from 'lodash.debounce'
import Ele from '../core/ele'

let ele: HTMLImageElement = null
let modal: Ele<HTMLElement> = null
let clonedEle: Ele<HTMLImageElement> = null

export function imgViewer(
  element: HTMLImageElement,
  container = document.documentElement,
) {
  // Prevent the element closure
  ele = element
  // init modal
  if (!modal) {
    modal = new Ele<HTMLElement>('div')
    modal.setStyle({
      display: 'none',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      transition: '.3s',
      zIndex: '1',
    })
    modal.on('click', closeModal)
    window.addEventListener(
      'resize',
      debounce(
        () =>
          setPosition(calcLastPosition(ele.naturalWidth, ele.naturalHeight)),
        100,
      ),
    )
    document.body.append(modal.ele)
  }

  // init clonedEle
  if (!clonedEle) {
    clonedEle = new Ele<HTMLImageElement>('img')
    clonedEle.setStyle({
      display: 'none',
      position: 'absolute',
      top: '0',
      left: '0',
      border: 'none',
      outline: 'none',
      margin: '0',
      transition: '.3s',
      willChange: 'transform, width, height',
      userSelect: 'none',
    })
    modal.append(clonedEle)
  }
  clonedEle.src = ele.src
  clonedEle.style.cursor = 'zoom-out'
  clonedEle.style.display = 'initial'

  const setPosition = setPositionWithEle(clonedEle.ele)
  setPosition(calcFirstPosition(ele, container))

  // close modal
  function closeModal(e: Event) {
    clonedEle.on(
      'transitionend',
      function hideModal() {
        modal.hide()
        ele.style.visibility = 'initial'
        ele = null
        clonedEle.style.display = 'none'
        clonedEle.src = ''
        clonedEle.off('transitionend', hideModal)
      },
      { once: true },
    )

    setPosition(calcFirstPosition(ele, container))
    clonedEle.style.cursor = 'initial'
    modal.style.background = '#0000'
    modal.style['backdropFilter'] = 'none'

    e.stopPropagation()
    e.preventDefault()
    return false
  }

  modal.show()

  requestAnimationFrame(() => {
    setPosition(calcLastPosition(ele.naturalWidth, ele.naturalHeight))
    ele.style.visibility = 'hidden'
    modal.style.background = '#000b'
    modal.style['backdropFilter'] = 'blur(10px)'
  })
}

type Posi = {
  width: number
  height: number
  rate?: number
  x: number
  y: number
}
function setElePosition(element: HTMLImageElement, position: Posi): void {
  Object.assign(element.style, {
    width: position.width + 'px',
    height: position.height + 'px',
    transform: `translate(${position.x}px, ${position.y}px)`,
  })
}
function setPositionWithEle(
  element: HTMLImageElement,
): (position: Posi) => void {
  return (position: Posi) => setElePosition(element, position)
}
function calcFirstPosition(
  element: HTMLImageElement,
  container: HTMLElement,
): Posi {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
    x: element.offsetLeft - container.scrollLeft,
    y: element.offsetTop - container.scrollTop,
  }
}
function calcLastPosition(width: number, height: number): Posi {
  const rate = width / height
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  let lastWidth = width
  let lastHeight = height
  if (lastWidth > screenWidth || lastHeight > screenHeight) {
    lastWidth = screenWidth
    lastHeight = lastWidth / rate
    if (lastHeight > screenHeight) {
      lastHeight = screenHeight
      lastWidth = lastHeight * rate
    }
  }
  const lastPositionX = (screenWidth - lastWidth) / 2
  const lastPositionY = (screenHeight - lastHeight) / 2

  return {
    width: lastWidth,
    height: lastHeight,
    x: lastPositionX,
    y: lastPositionY,
    rate,
  }
}
