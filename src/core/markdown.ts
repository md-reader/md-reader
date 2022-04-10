import hljs from 'highlight.js'
import markdownIt from 'markdown-it'
import mEmoji from 'markdown-it-emoji'
import mSub from 'markdown-it-sub'
import mSup from 'markdown-it-sup'
import mIns from 'markdown-it-ins'
import mAbbr from 'markdown-it-abbr'
import mMark from 'markdown-it-mark'
import mDeflist from 'markdown-it-deflist'
import mFootnote from 'markdown-it-footnote'
import mTaskLists from 'markdown-it-task-lists'
import mContainer from 'markdown-it-container'
import mToc from 'markdown-it-table-of-contents'
import mMultimdTable from 'markdown-it-multimd-table'
import MD_PLUGINS from '../config/md-plugins'

const PLUGINS = {
  Emoji: [mEmoji],
  Sub: [mSub],
  Sup: [mSup],
  Ins: [mIns],
  Abbr: [mAbbr],
  Mark: [mMark],
  Deflist: [mDeflist],
  Footnote: [mFootnote],
  TaskLists: [mTaskLists],
  TOC: [mToc],
  Warning: [
    mContainer,
    'warning',
    {
      render(tokens, idx) {
        return tokens[idx].nesting === 1
          ? '<blockquote class="warning">\n'
          : '</blockquote>\n'
      },
    },
  ],
  Tips: [
    mContainer,
    'tips',
    {
      render(tokens, idx) {
        return tokens[idx].nesting === 1
          ? '<blockquote class="tip">\n'
          : '</blockquote>\n'
      },
    },
  ],
}

export interface MdOptions {
  config?: markdownIt.Options
  plugins?: Array<string>
}

function initRender({ config = {}, plugins = [...MD_PLUGINS] }: MdOptions) {
  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    xhtmlOut: true,
    typographer: true,
    highlight(str: string, language: string) {
      if (language && hljs.getLanguage(language)) {
        try {
          return `<pre class="hljs-pre"><code class="hljs" lang="${language}">${
            hljs.highlight(str, { language, ignoreIllegals: true }).value
          }</code></pre>`
        } catch (err) {
          console.error(err)
          return 'parse error'
        }
      }
      return ''
    },
    ...config,
  })

  // default plugins
  md.use(mMultimdTable)

  // custom plugins
  plugins.forEach(name => {
    const plugin = PLUGINS[name]
    plugin && md.use(plugin[0], ...plugin.slice(1))
  })

  return md
}

interface MdRender {
  (code: string, options: MdOptions): string
  md?: markdownIt
}
export const mdRender: MdRender = (code, options): string => {
  if (!mdRender.md || options) {
    mdRender.md = initRender(options)
  }
  return mdRender.md.render(code)
}

export default initRender
