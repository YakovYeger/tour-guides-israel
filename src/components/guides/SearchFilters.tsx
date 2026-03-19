import { useTranslation } from 'react-i18next'
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchFiltersProps {
  filters: {
    regions: string[]
    tourTypes: string[]
    languages: string[]
  }
  onFilterChange: (key: string, values: string[]) => void
  onClearAll: () => void
}

const REGIONS = ['tel_aviv', 'jerusalem', 'haifa', 'galilee', 'negev', 'dead_sea', 'eilat', 'golan']
const TOUR_TYPES = ['historical', 'culinary', 'adventure', 'religious', 'nature', 'family', 'photography', 'wine']
const LANGUAGES = ['en', 'he', 'ar', 'ru', 'fr', 'de', 'es', 'it', 'zh', 'ja']

export function SearchFilters({ filters, onFilterChange, onClearAll }: SearchFiltersProps) {
  const { t } = useTranslation(['guides', 'common'])

  const hasActiveFilters = filters.regions.length > 0 || filters.tourTypes.length > 0 || filters.languages.length > 0

  const toggleFilter = (key: 'regions' | 'tourTypes' | 'languages', value: string) => {
    const current = filters[key]
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onFilterChange(key, updated)
  }

  return (
    <div className="island-shell rounded-2xl p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-sunset" />
          <h2 className="font-semibold text-desert-ink">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-desert-ink-soft">
            <X className="h-4 w-4 mr-1" />
            {t('guides:search.filters.clearAll')}
          </Button>
        )}
      </div>

      {/* Regions */}
      <FilterSection title={t('guides:search.filters.region')}>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((region) => (
            <FilterChip
              key={region}
              label={t(`common:regions.${region}`)}
              active={filters.regions.includes(region)}
              onClick={() => toggleFilter('regions', region)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Tour Types */}
      <FilterSection title={t('guides:search.filters.tourType')}>
        <div className="flex flex-wrap gap-2">
          {TOUR_TYPES.map((type) => (
            <FilterChip
              key={type}
              label={t(`common:tourTypes.${type}`)}
              active={filters.tourTypes.includes(type)}
              onClick={() => toggleFilter('tourTypes', type)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Languages */}
      <FilterSection title={t('guides:search.filters.language')}>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <FilterChip
              key={lang}
              label={t(`common:languages.${lang}`)}
              active={filters.languages.includes(lang)}
              onClick={() => toggleFilter('languages', lang)}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-desert-ink-soft mb-3">{title}</h3>
      {children}
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
        active
          ? 'bg-sunset text-white'
          : 'bg-chip-bg border border-chip-line text-desert-ink-soft hover:border-sunset/50 hover:text-sunset'
      )}
    >
      {label}
    </button>
  )
}

