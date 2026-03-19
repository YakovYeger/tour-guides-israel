import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Grid3X3, List, Loader2 } from 'lucide-react'
import { useGuides, type GuideFilters } from '@/hooks/use-guides'
import { GuideCard } from '@/components/guides/GuideCard'
import { SearchFilters } from '@/components/guides/SearchFilters'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/guides/')({
  component: GuidesPage,
  head: () => ({
    meta: [
      { title: 'Find Tour Guides | Tour Guides Israel' },
      { name: 'description', content: 'Browse licensed professional tour guides across Israel. Filter by region, language, and tour type.' },
    ],
  }),
})

function GuidesPage() {
  const { t } = useTranslation(['guides', 'common'])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<{
    regions: string[]
    tourTypes: string[]
    languages: string[]
  }>({
    regions: [],
    tourTypes: [],
    languages: [],
  })
  const [sortBy, setSortBy] = useState<GuideFilters['sortBy']>('recommended')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { data: guides, isLoading, error } = useGuides({
    regions: filters.regions,
    tourTypes: filters.tourTypes,
    languages: filters.languages,
    search: searchQuery,
    sortBy,
  })

  const handleFilterChange = (key: string, values: string[]) => {
    setFilters(prev => ({ ...prev, [key]: values }))
  }

  const handleClearAll = () => {
    setFilters({ regions: [], tourTypes: [], languages: [] })
    setSearchQuery('')
  }

  return (
    <div className="py-8 md:py-12">
      <div className="page-wrap">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="display-title text-3xl md:text-4xl font-bold text-desert-ink mb-3">
            {t('guides:search.title')}
          </h1>
          <p className="text-lg text-desert-ink-soft max-w-2xl mx-auto">
            {t('guides:search.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-desert-ink-soft" />
            <Input
              type="text"
              placeholder="Search by name, location, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <SearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-desert-ink-soft">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  t('guides:search.results', { count: guides?.length || 0 })
                )}
              </p>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as GuideFilters['sortBy'])}
                  className="text-sm border border-line rounded-lg px-3 py-2 bg-surface focus:outline-none focus:ring-2 focus:ring-sunset/50"
                >
                  <option value="recommended">{t('guides:search.sortOptions.recommended')}</option>
                  <option value="rating">{t('guides:search.sortOptions.rating')}</option>
                  <option value="experience">{t('guides:search.sortOptions.experience')}</option>
                  <option value="reviews">{t('guides:search.sortOptions.reviews')}</option>
                </select>

                {/* View Toggle */}
                <div className="flex border border-line rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-sunset text-white' : 'bg-surface text-desert-ink-soft hover:bg-link-bg-hover'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-sunset text-white' : 'bg-surface text-desert-ink-soft hover:bg-link-bg-hover'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Guide Grid */}
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading guides. Please try again.</p>
              </div>
            ) : guides && guides.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {guides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} featured={guide.is_featured} />
                ))}
              </div>
            ) : !isLoading ? (
              <div className="text-center py-12">
                <p className="text-desert-ink-soft mb-4">{t('guides:search.noResults')}</p>
                <Button variant="outline" onClick={handleClearAll}>
                  {t('guides:search.filters.clearAll')}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

