import localeJson from './locale.json'

/* Unmatched languages (in locale.json file) default use the 'en'. */
const DEFAULT_LOCALE: string = 'en'

interface Localize {
  (field?: string): string
}

interface I18n {
  (locale?: string): (field: string) => string
  localeJson: Object
  DEFAULT_LOCALE: string
}

const i18n: I18n = (
  locale: string = DEFAULT_LOCALE,
): ((field: string) => string) => {
  const defaultLocalizeMap: Localize = localeJson[DEFAULT_LOCALE]
  const localizeMap: Localize = localeJson[locale] || defaultLocalizeMap
  return function localize(field: string): string {
    /* Also includes fields (default 'en') */
    return localizeMap[field] || defaultLocalizeMap[field] || field
  }
}

i18n.localeJson = localeJson
i18n.DEFAULT_LOCALE = DEFAULT_LOCALE

export default i18n
