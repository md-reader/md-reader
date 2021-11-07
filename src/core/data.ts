import MD_PLUGINS from '../config/md-plugins'
import PAGE_THEMES from '../config/page-themes'
import i18n from '../popup/i18n'

interface Data {
  enable?: boolean
  refresh?: boolean
  language?: string
  mdPlugins?: typeof MD_PLUGINS
  pageTheme?: typeof PAGE_THEMES[0]
}

export function getDefaultData(): Data {
  return {
    enable: true,
    refresh: true,
    language: i18n().locale,
    mdPlugins: [...MD_PLUGINS],
    pageTheme: PAGE_THEMES[0],
  }
}

export default Data
