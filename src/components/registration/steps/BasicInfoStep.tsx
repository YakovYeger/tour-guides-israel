import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { StepProps } from '../types'

export function BasicInfoStep({ data, updateData, onNext }: StepProps) {
  const { t } = useTranslation(['guides', 'common', 'auth'])

  const isValid = data.fullName && data.email && data.phone && data.bio

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-desert-ink mb-2">Basic Information</h2>
        <p className="text-desert-ink-soft">Let's start with some basic details about you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-desert-ink">{t('auth:signup.fullName')} *</label>
          <Input
            type="text"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            placeholder="John Smith"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-desert-ink">{t('auth:signup.email')} *</label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="john@example.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-desert-ink">Phone Number *</label>
        <Input
          type="tel"
          value={data.phone}
          onChange={(e) => updateData({ phone: e.target.value })}
          placeholder="+972 50 123 4567"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-desert-ink">About You *</label>
        <textarea
          value={data.bio}
          onChange={(e) => updateData({ bio: e.target.value })}
          placeholder="Tell travelers about yourself, your background, and what makes your tours special..."
          rows={5}
          required
          className="flex w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-desert-ink-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/50 focus-visible:border-sunset disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        />
        <p className="text-xs text-desert-ink-soft">Minimum 100 characters recommended</p>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" disabled={!isValid}>
          Continue
        </Button>
      </div>
    </form>
  )
}

