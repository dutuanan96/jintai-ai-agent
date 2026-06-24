import vi from './vi.json'
import en from './en.json'
import zh from './zh.json'

const translations = { vi, en, zh }

let currentLang = 'vi'

export function setLanguage(lang) {
  currentLang = lang
}

export function getLanguage() {
  return currentLang
}

export function t(key, params = {}) {
  const keys = key.split('.')
  let value = translations[currentLang]
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k]
    } else {
      return key // Fallback to key if not found
    }
  }
  
  if (typeof value !== 'string') return key
  
  // Replace {param} placeholders
  return value.replace(/\{(\w+)\}/g, (match, name) => {
    return params[name] !== undefined ? params[name] : match
  })
}