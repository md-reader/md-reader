import debounce from 'lodash.debounce'
import className from '../config/class-name'
import Ele from '../core/ele'

let ele: HTMLImageElement = null
let modal: Ele<HTMLElement> = null
let clonedEle: Ele<HTMLImageElement> = null
let setPosition = null
const debounceSetLastPosition = debounce(() => {
  setPosition(calcLastPosition(ele.naturalWidth, ele.naturalHeight))
}, 100)

export function imgViewer(
  element: HTMLImageElement,
  container = document.documentElement,
) {
  // prevent the element closure
  ele = element

  // init modal
  if (!modal) {
    modal = new Ele<HTMLElement>('div', {
      className: className.MODAL,
    })
    modal.on('click', closeModal)
    document.body.append(modal.ele)
  }

  // init clonedEle
  if (!clonedEle) {
    clonedEle = new Ele<HTMLImageElement>('img', {
      className: className.ZOOM_IMAGE,
    })
    setPosition = setPositionWithEle(clonedEle.ele)
    modal.append(clonedEle)
  }
  // init first position
  setPosition(calcFirstPosition(ele, container))
  clonedEle.src = ele.src
  clonedEle.show()

  // close modal
  function closeModal(e: Event) {
    if (modal.classList.contains('opened')) {
      modal.on(
        'transitionend',
        function hidden() {
          ele = ele.style.visibility = null
          modal.hide()
          clonedEle.hide()
          clonedEle.src = ''
          modal.off('transitionend', hidden)
        },
        { once: true },
      )

      setPosition(calcFirstPosition(ele, container))
      modal.classList.remove('opened')
      window.removeEventListener('resize', debounceSetLastPosition)
    }

    return e.stopPropagation(), e.preventDefault(), false
  }

  // open the modal
  modal.show()

  // transition to last position after the modal opened
  requestAnimationFrame(() => {
    setPosition(calcLastPosition(ele.naturalWidth, ele.naturalHeight))
    ele.style.visibility = 'hidden'
    modal.classList.add('opened')
  })

  // update last position
  window.addEventListener('resize', debounceSetLastPosition)
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
