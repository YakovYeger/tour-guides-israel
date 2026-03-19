import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

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
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLocale, // Always start with default locale for SSR consistency
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    defaultNS: 'common',
    ns: ['common', 'home', 'auth', 'guides'],
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

export function isRTL(locale: string): boolean {
  return locale === 'he'
}

export function getDirection(locale: string): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr'
}

