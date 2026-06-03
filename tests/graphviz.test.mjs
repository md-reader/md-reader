import test from 'node:test'
import assert from 'node:assert/strict'
import MarkdownIt from 'markdown-it'
import MermaidPlugin from '@md-reader/markdown-it-mermaid'

const loadGraphviz = () => import('../src/core/graphviz.ts')

test('treats digraph blocks as graphviz diagrams', async () => {
  const { isGraphvizCodeBlock } = await loadGraphviz()

  assert.equal(isGraphvizCodeBlock('digraph', 'digraph G { a -> b }'), true)
  assert.equal(isGraphvizCodeBlock('dot', 'digraph G { a -> b }'), true)
  assert.equal(isGraphvizCodeBlock('graphviz', 'graph G { a -- b }'), true)
})

test('routes digraph content inside mermaid fences to graphviz', async () => {
  const { isGraphvizCodeBlock } = await loadGraphviz()

  assert.equal(isGraphvizCodeBlock('mermaid', 'digraph G { a -> b }'), true)
})

test('keeps regular mermaid flowcharts on the mermaid renderer', async () => {
  const { isGraphvizCodeBlock } = await loadGraphviz()

  assert.equal(
    isGraphvizCodeBlock('mermaid', 'graph TD\n  A[Start] --> B[Done]'),
    false,
  )
})

test('encodes graphviz placeholders safely', async () => {
  const { decodeGraphvizSource, renderGraphvizPlaceholder } =
    await loadGraphviz()
  const code = 'digraph G {\n  a -> b [label="a < b"];\n}'

  const html = renderGraphvizPlaceholder(code)
  const sourceMatch = html.match(/data-graphviz-source="([^"]+)"/)

  assert.ok(sourceMatch, 'expected graphviz source data attribute')
  assert.equal(decodeGraphvizSource(sourceMatch[1]), code)
  assert.match(html, /md-reader__graphviz/)
})

test('markdown-it integration can route graphviz fences without touching mermaid flowcharts', async () => {
  const { isGraphvizCodeBlock, renderGraphvizPlaceholder } =
    await loadGraphviz()
  const md = new MarkdownIt()
  const fallbackFence = md.renderer.rules.fence?.bind(md.renderer.rules)

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const info = token.info.trim()
    const code = token.content.trim()

    if (isGraphvizCodeBlock(info, code)) {
      return renderGraphvizPlaceholder(code)
    }

    return fallbackFence
      ? fallbackFence(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options)
  }

  const dotHtml = md.render('```digraph\ndigraph G { a -> b }\n```')
  const mermaidHtml = md.render('```mermaid\ngraph TD\n  A --> B\n```')

  assert.match(dotHtml, /md-reader__graphviz/)
  assert.doesNotMatch(mermaidHtml, /md-reader__graphviz/)
})

test('graphviz override still works after mermaid plugin is installed first', async () => {
  const { isGraphvizCodeBlock, renderGraphvizPlaceholder } =
    await loadGraphviz()
  const md = new MarkdownIt()
  md.use(MermaidPlugin)

  const fallbackFence = md.renderer.rules.fence?.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const info = token.info.trim()
    const code = token.content.trim()

    if (isGraphvizCodeBlock(info, code)) {
      return renderGraphvizPlaceholder(code)
    }

    return fallbackFence
      ? fallbackFence(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options)
  }

  const html = md.render('```mermaid\ndigraph G { a -> b }\n```')

  assert.match(html, /md-reader__graphviz/)
})
