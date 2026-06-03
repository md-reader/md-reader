const GRAPHVIZ_INFO_TOKENS = new Set(['digraph', 'dot', 'graphviz'])
const GRAPHVIZ_SOURCE_PREFIX =
  /^(?:strict\s+)?(?:(?:di)?graph\b(?:\s+["\w.-]+)?\s*\{|(?:di)?graph\s*\{)/i

export const GRAPHVIZ_CLASS = 'md-reader__graphviz'
export const GRAPHVIZ_CONTENT_CLASS = `${GRAPHVIZ_CLASS}-content`
export const GRAPHVIZ_ERROR_CLASS = `${GRAPHVIZ_CLASS}-error`
export const GRAPHVIZ_SOURCE_ATTR = 'data-graphviz-source'
export const GRAPHVIZ_STATUS_ATTR = 'data-graphviz-status'

export function isGraphvizCodeBlock(
  info: string = '',
  code: string = '',
): boolean {
  const token = info.trim().toLowerCase()
  if (GRAPHVIZ_INFO_TOKENS.has(token)) {
    return true
  }
  if (token === 'mermaid') {
    return GRAPHVIZ_SOURCE_PREFIX.test(code.trimStart())
  }
  return false
}

export function encodeGraphvizSource(code: string): string {
  const utf8 = encodeURIComponent(code).replace(
    /%([0-9A-F]{2})/g,
    (_, hex: string) => String.fromCharCode(parseInt(hex, 16)),
  )
  return btoa(utf8)
}

export function decodeGraphvizSource(value: string): string {
  const utf8 = atob(value)
  const encoded = Array.from(
    utf8,
    char => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`,
  ).join('')
  return decodeURIComponent(encoded)
}

export function renderGraphvizPlaceholder(code: string): string {
  const source = encodeGraphvizSource(code)
  return `<pre class="${GRAPHVIZ_CLASS}" ${GRAPHVIZ_SOURCE_ATTR}="${source}" ${GRAPHVIZ_STATUS_ATTR}="pending"><code class="${GRAPHVIZ_CONTENT_CLASS}">${escapeHtml(
    code,
  )}</code></pre>`
}

function escapeHtml(content: string): string {
  return String(content)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
