import MD_PLUGINS from '../config/md-plugins'
import PAGE_THEMES from '../config/page-themes'
import i18n from '../popup/i18n'

interface Data {
  enable?: boolean
  refresh?: boolean
  pageTheme?: typeof PAGE_THEMES[0]
  locale?: string
  mdPlugins?: typeof MD_PLUGINS
}

export function getDefaultData(): Data {
  return {
    enable: true,
    refresh: true,
    pageTheme: PAGE_THEMES[0],
    locale: i18n().locale,
    mdPlugins: [...MD_PLUGINS],
  } as Data
}

export default Data
