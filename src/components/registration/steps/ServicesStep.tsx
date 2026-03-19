import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { StepProps } from '../types'

const TOUR_TYPES = ['historical', 'culinary', 'adventure', 'religious', 'nature', 'family', 'photography', 'wine', 'architecture']
const REGIONS = ['tel_aviv', 'jerusalem', 'haifa', 'galilee', 'negev', 'dead_sea', 'eilat', 'golan']
const DURATIONS = ['half_day', 'full_day', 'multi_day']

export function ServicesStep({ data, updateData, onNext, onBack }: StepProps) {
  const { t } = useTranslation(['guides', 'common'])

  const toggleItem = (key: 'tourTypes' | 'regionsCovered' | 'tourDurationOptions', value: string) => {
    const current = data[key]
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    updateData({ [key]: updated })
  }

  const isValid = data.tourTypes.length > 0 && data.regionsCovered.length > 0 && data.tourDurationOptions.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-desert-ink mb-2">Services & Regions</h2>
        <p className="text-desert-ink-soft">What types of tours do you offer and where?</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-desert-ink">Tour Types *</label>
        <div className="flex flex-wrap gap-2">
          {TOUR_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleItem('tourTypes', type)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                data.tourTypes.includes(type)
                  ? 'bg-sunset text-white'
                  : 'bg-chip-bg border border-chip-line text-desert-ink-soft hover:border-sunset/50'
              )}
            >
              {t(`common:tourTypes.${type}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-desert-ink">Regions Covered *</label>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => toggleItem('regionsCovered', region)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                data.regionsCovered.includes(region)
                  ? 'bg-accent-500 text-white'
                  : 'bg-chip-bg border border-chip-line text-desert-ink-soft hover:border-accent-500/50'
              )}
            >
              {t(`common:regions.${region}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-desert-ink">Tour Duration Options *</label>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((duration) => (
            <button
              key={duration}
              type="button"
              onClick={() => toggleItem('tourDurationOptions', duration)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                data.tourDurationOptions.includes(duration)
                  ? 'bg-earth-600 text-white'
                  : 'bg-chip-bg border border-chip-line text-desert-ink-soft hover:border-earth-500/50'
              )}
            >
              {duration.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-desert-ink">Max Group Size</label>
          <Input
            type="number"
            min="1"
            max="100"
            value={data.maxGroupSize}
            onChange={(e) => updateData({ maxGroupSize: parseInt(e.target.value) || 10 })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-desert-ink">Do you have a vehicle?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={data.hasVehicle}
                onChange={() => updateData({ hasVehicle: true })}
                className="w-4 h-4 text-sunset"
              />
              <span className="text-desert-ink-soft">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!data.hasVehicle}
                onChange={() => updateData({ hasVehicle: false, vehicleType: '' })}
                className="w-4 h-4 text-sunset"
              />
              <span className="text-desert-ink-soft">No</span>
            </label>
          </div>
        </div>
      </div>

      {data.hasVehicle && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-desert-ink">Vehicle Type</label>
          <Input
            type="text"
            value={data.vehicleType}
            onChange={(e) => updateData({ vehicleType: e.target.value })}
            placeholder="e.g., 7-seater van, sedan, minibus"
          />
        </div>
      )}

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

