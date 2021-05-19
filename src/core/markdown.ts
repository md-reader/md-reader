import hljs from 'highlight.js'
import markdownIt from 'markdown-it'
import mEmoji from 'markdown-it-emoji'
import mSub from 'markdown-it-sub'
import mSup from 'markdown-it-sup'
import mIns from 'markdown-it-ins'
import mMark from 'markdown-it-mark'
import mFootnote from 'markdown-it-footnote'
import mDeflist from 'markdown-it-deflist'
import mAbbr from 'markdown-it-abbr'

const md = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
  xhtmlOut: true,
  highlight(str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs-pre"><code class="hljs" lang="${lang}">${
          hljs.highlight(lang, str, true).value
        }</code></pre>`
      } catch (err) {
        console.error(err)
        return 'parse error'
      }
    }
    return ''
  },
})

md.use(mEmoji)
  .use(mSub)
  .use(mSup)
  .use(mIns)
  .use(mMark)
  .use(mFootnote)
  .use(mDeflist)
  .use(mAbbr)

export default md
