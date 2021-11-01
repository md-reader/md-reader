import localMap from './local.json'

const DEFAULT_LANG = 'en-US'

export default function i18n(lang = DEFAULT_LANG) {
  const defaultLocalMap = localMap[DEFAULT_LANG]
  const local = localMap[lang] || defaultLocalMap
  return function getLocal(key) {
    return local[key] || defaultLocalMap[key] || key
  }
}

i18n.localMap = localMap
