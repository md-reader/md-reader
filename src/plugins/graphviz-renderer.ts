import { instance } from '@viz-js/viz'
import {
  decodeGraphvizSource,
  GRAPHVIZ_CLASS,
  GRAPHVIZ_CONTENT_CLASS,
  GRAPHVIZ_ERROR_CLASS,
  GRAPHVIZ_SOURCE_ATTR,
  GRAPHVIZ_STATUS_ATTR,
} from '@/core/graphviz'

let vizPromise: ReturnType<typeof instance> | null = null

function getViz() {
  if (!vizPromise) {
    vizPromise = instance()
  }
  return vizPromise
}

function createErrorElement(message: string) {
  const error = document.createElement('div')
  error.className = GRAPHVIZ_ERROR_CLASS
  error.textContent = message
  return error
}

async function renderGraphvizElement(element: HTMLElement) {
  const status = element.getAttribute(GRAPHVIZ_STATUS_ATTR)
  if (status === 'rendering' || status === 'ready') {
    return
  }

  const source = element.getAttribute(GRAPHVIZ_SOURCE_ATTR)
  if (!source) {
    return
  }

  const code = decodeGraphvizSource(source)
  const codeElement = element.querySelector(`.${GRAPHVIZ_CONTENT_CLASS}`)
  const previousError = element.querySelector(`.${GRAPHVIZ_ERROR_CLASS}`)
  previousError?.remove()

  element.setAttribute(GRAPHVIZ_STATUS_ATTR, 'rendering')

  try {
    const viz = await getViz()
    const svg = viz.renderSVGElement(code)
    svg.classList.add(`${GRAPHVIZ_CLASS}-svg`)
    codeElement?.replaceWith(svg)
    element.setAttribute(GRAPHVIZ_STATUS_ATTR, 'ready')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!codeElement) {
      const fallbackCode = document.createElement('code')
      fallbackCode.className = GRAPHVIZ_CONTENT_CLASS
      fallbackCode.textContent = code
      element.appendChild(fallbackCode)
    }
    element.appendChild(createErrorElement(message))
    element.setAttribute(GRAPHVIZ_STATUS_ATTR, 'error')
  }
}

export async function renderGraphviz(container: ParentNode = document) {
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(`.${GRAPHVIZ_CLASS}`),
  )
  await Promise.all(elements.map(element => renderGraphvizElement(element)))
}

export default function GraphvizRendererPlugin({ event }) {
  event.on('contentRendered', (container: HTMLElement) => {
    void renderGraphviz(container)
  })
}
