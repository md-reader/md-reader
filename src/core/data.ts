import MD_PLUGINS from '../config/md-plugins'
import PAGE_THEMES from '../config/page-themes'
import i18n from '../popup/i18n'

interface Data {
  enable?: boolean
  refresh?: boolean
  pageTheme?: typeof PAGE_THEMES[0]
  language?: string
  selectedMdPlugins?: typeof MD_PLUGINS
}

export function getDefaultData(): Data {
  return {
    enable: true,
    refresh: true,
    pageTheme: PAGE_THEMES[0],
    language: i18n().locale,
    selectedMdPlugins: [...MD_PLUGINS],
  } as Data
}

export default Data
