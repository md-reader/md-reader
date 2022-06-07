import MD_PLUGINS from '../config/md-plugins'
import PAGE_THEMES from '../config/page-themes'
import i18n from '../popup/i18n'

export interface Data {
  enable?: boolean
  refresh?: boolean
  language?: string
  centered?: boolean
  mdPlugins?: typeof MD_PLUGINS
  pageTheme?: typeof PAGE_THEMES[0]
}

export function getDefaultData(mergeData: Data): Data {
  return {
    enable: true,
    refresh: false,
    centered: true,
    language: i18n().locale,
    mdPlugins: [...MD_PLUGINS],
    pageTheme: PAGE_THEMES[0],
    ...mergeData,
  }
}
