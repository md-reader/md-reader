import localeJson from './locale.json'

/** Unmatched languages (in locale.json file) will default to the 'en'.*/
const DEFAULT_LOCALE: string = 'en';

export default function i18n(locale: string = DEFAULT_LOCALE): (field: string)=>string {
  const defaultLocalizeMap :Object = localeJson[DEFAULT_LOCALE]
  const localizeMap        :Object = localeJson[locale] || defaultLocalizeMap
  return function localize(field: string): string {
    // Also include fields
    return localizeMap[field] || defaultLocalizeMap[field] || field
  }
}

i18n.localeJson = localeJson
i18n.DEFAULT_LOCALE = DEFAULT_LOCALE