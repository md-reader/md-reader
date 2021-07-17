import localMap from './local.json'

const defaultLang = 'en-US'

export default function i18n(lang = defaultLang) {
  const local = localMap[lang] || localMap[defaultLang]
  return function getLocal(key) {
    return local[key] || localMap[defaultLang][key] || key
  }
}

i18n.localMap = localMap
