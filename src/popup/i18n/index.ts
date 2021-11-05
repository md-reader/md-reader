import localeJson from './locale.json'

/* Unmatched languages (in locale.json file) default use the 'en'. */
const DEFAULT_LOCALE: string = 'en'
/* The default locale set in your browser. */
const BROWSER_LOCALE: string = chrome.i18n.getUILanguage()

interface Localize {
  (field: string): string
  locale: string
}

interface I18n {
  (locale?: string): Localize
  localeJson: Object
  locales: string[]
  DEFAULT_LOCALE: string
}

const i18n: I18n = (
  locale: string = localeJson[BROWSER_LOCALE] ? BROWSER_LOCALE : DEFAULT_LOCALE,
): Localize => {
  const defaultLocalizeMap: Localize = localeJson[DEFAULT_LOCALE]
  const localizeMap: Localize = localeJson[locale]

  const localize: Localize = (field: string): string => {
    /* Also includes fields (default 'en') */
    return localizeMap[field] || defaultLocalizeMap[field] || field
  }
  localize.locale = locale

  return localize
}

i18n.localeJson = localeJson
i18n.locales = Object.keys(i18n.localeJson)
i18n.DEFAULT_LOCALE = DEFAULT_LOCALE
