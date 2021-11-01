import localeMap from './locale.json'

/**
 * Unmatched languages (in locale.json file) will default to the 'en'.
 */
export const DEFAULT_LANG = 'en'

export default function i18n(lang = DEFAULT_LANG) {
  const defaultLocaleMap = localeMap[DEFAULT_LANG]
  const locale = localeMap[lang] || defaultLocaleMap
  return function getLocale(field) {
    // Also include fields
    return locale[field] || defaultLocaleMap[field] || field
  }
}

i18n.localeMap = localeMap
