import localeJson from './locale.json'

/* Unmatched language (in locale.json file) default use the 'en'. */
const DEFAULT_LOCALE: string = 'en'
/* The language of your browser Settings. */
const BROWSER_LOCALE: string = chrome.i18n.getUILanguage()
const targetLocale =
  BROWSER_LOCALE in localeJson ? BROWSER_LOCALE : DEFAULT_LOCALE

interface Localize {
  (field: string): string
  locale: string
}

interface I18n {
  (locale?: string): Localize
  locales: string[]
}

const i18n: I18n = (locale: string = targetLocale): Localize => {
  const defaultLocalizeMap: Object = localeJson[DEFAULT_LOCALE]
  const localizeMap: Object = localeJson[locale] || defaultLocalizeMap

  const localize: Localize = (field: string): string => {
    /* Also includes fields (default 'en') */
    return localizeMap[field] || defaultLocalizeMap[field] || field
  }
  localize.locale = locale

  return localize
}

i18n.locales = Object.keys(localeJson)

export default i18n
