import localMap from './local.json'

/**
 * Unmatched languages (in local.json file) will default to the 'en'.
 */
export const DEFAULT_LANG = 'en'

export default function i18n(lang = DEFAULT_LANG) {
  const defaultLocalMap = localMap[DEFAULT_LANG]
  const local = localMap[lang] || defaultLocalMap
  return function getLocal(field) {
    // Also include fields
    return local[field] || defaultLocalMap[field] || field
  }
}

i18n.localMap = localMap
