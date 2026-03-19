import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { StepProps } from '../types'

const LANGUAGES = ['en', 'he', 'ar', 'ru', 'fr', 'de', 'es', 'it', 'pt', 'zh', 'ja']

export function ProfessionalStep({ data, updateData, onNext, onBack }: StepProps) {
  const { t } = useTranslation(['guides', 'common'])

  const toggleLanguage = (lang: string) => {
    const updated = data.languages.includes(lang)
      ? data.languages.filter(l => l !== lang)
      : [...data.languages, lang]
    updateData({ languages: updated })
  }

  const isValid = data.yearsExperience >= 0 && data.languages.length > 0 && data.uniqueApproach && data.whyTourGuide

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-desert-ink mb-2">Professional Details</h2>
        <p className="text-desert-ink-soft">Tell us about your experience and expertise</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-desert-ink">Years of Experience *</label>
          <Input
            type="number"
            min="0"
            max="50"
            value={data.yearsExperience}
            onChange={(e) => updateData({ yearsExperience: parseInt(e.target.value) || 0 })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-desert-ink">License Number (optional)</label>
          <Input
            type="text"
            value={data.licensedGuideNumber}
            onChange={(e) => updateData({ licensedGuideNumber: e.target.value })}
            placeholder="e.g., 12345"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-desert-ink">Languages You Speak *</label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLanguage(lang)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                data.languages.includes(lang)
                  ? 'bg-sunset text-white'
                  : 'bg-chip-bg border border-chip-line text-desert-ink-soft hover:border-sunset/50'
              )}
            >
              {t(`common:languages.${lang}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-desert-ink">Your Unique Approach *</label>
        <textarea
          value={data.uniqueApproach}
          onChange={(e) => updateData({ uniqueApproach: e.target.value })}
          placeholder="What makes your tours different? What's your guiding philosophy?"
          rows={4}
          required
          className="flex w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-desert-ink-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/50 focus-visible:border-sunset transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-desert-ink">Why Did You Become a Tour Guide? *</label>
        <textarea
          value={data.whyTourGuide}
          onChange={(e) => updateData({ whyTourGuide: e.target.value })}
          placeholder="Share your story and passion for guiding..."
          rows={4}
          required
          className="flex w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-desert-ink-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/50 focus-visible:border-sunset transition-colors"
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="lg" disabled={!isValid}>
          Continue
        </Button>
      </div>
    </form>
  )
}

