import type MarkdownIt from 'markdown-it'
import { isGraphvizCodeBlock, renderGraphvizPlaceholder } from '@/core/graphviz'

export default function GraphvizBlockPlugin(md: MarkdownIt) {
  const fallbackFence = md.renderer.rules.fence?.bind(md.renderer.rules)

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const info = token.info.trim()
    const code = token.content.trim()

    if (isGraphvizCodeBlock(info, code)) {
      return renderGraphvizPlaceholder(code)
    }

    if (fallbackFence) {
      return fallbackFence(tokens, idx, options, env, self)
    }

    return self.renderToken(tokens, idx, options)
  }
}
