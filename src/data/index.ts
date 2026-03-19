export { regions, getRegionBySlug, getRegionById } from './regions'
export { themes, getThemeBySlug, getThemeById } from './themes'

// Languages available
export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
]

export function getLanguageName(code: string): string {
  const lang = languages.find((l) => l.code === code)
  return lang?.name || code
}

// Cancellation policies
export const cancellationPolicies = {
  flexible: {
    name: 'Flexible',
    description: 'Full refund up to 24 hours before the tour',
  },
  moderate: {
    name: 'Moderate',
    description: 'Full refund up to 7 days before the tour',
  },
  strict: {
    name: 'Strict',
    description: 'Full refund up to 14 days before the tour',
  },
}

// Tour durations
export const tourDurations = {
  half: {
    name: 'Half Day',
    hours: '4-5 hours',
  },
  full: {
    name: 'Full Day',
    hours: '8-10 hours',
  },
  multi: {
    name: 'Multi-Day',
    hours: '2+ days',
  },
}

