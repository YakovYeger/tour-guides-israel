import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
import enCommon from '@/messages/en/common.json'
import enHome from '@/messages/en/home.json'
import enAuth from '@/messages/en/auth.json'
import enGuides from '@/messages/en/guides.json'
import heCommon from '@/messages/he/common.json'
import heHome from '@/messages/he/home.json'
import heAuth from '@/messages/he/auth.json'
import heGuides from '@/messages/he/guides.json'

export const defaultLocale = 'en'
export const locales = ['en', 'he'] as const
export type Locale = (typeof locales)[number]

export const resources = {
  en: {
    common: enCommon,
    home: enHome,
    auth: enAuth,
    guides: enGuides,
  },
  he: {
    common: heCommon,
    home: heHome,
    auth: heAuth,
    guides: heGuides,
  },
} as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    defaultNS: 'common',
    ns: ['common', 'home', 'auth', 'guides'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
    },
  })

export default i18n

export function isRTL(locale: string): boolean {
  return locale === 'he'
}

export function getDirection(locale: string): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr'
}

