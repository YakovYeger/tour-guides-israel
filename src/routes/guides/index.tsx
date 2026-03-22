import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  MapPin,
  Shield,
  Zap,
  SlidersHorizontal,
  Grid,
  List,
  X,
  ChevronDown,
  Star,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Rating } from '@/components/ui/rating'
import { Checkbox } from '@/components/ui/checkbox'
import { PageLoading } from '@/components/ui/loading-spinner'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { regions as allRegions } from '@/data/regions'
import { themes as allThemes } from '@/data/themes'
import { getLanguageName } from '@/data'
import type { Guide } from '@/types/database'

type SearchParams = {
  region?: string
  theme?: string
  q?: string
}

export const Route = createFileRoute('/guides/')({
  component: GuidesPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    region: search.region as string | undefined,
    theme: search.theme as string | undefined,
    q: search.q as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: 'Find Tour Guides | Tour Guides Israel' },
      { name: 'description', content: 'Browse licensed professional tour guides across Israel.' },
    ],
  }),
})

interface DirectoryFilters {
  regions: string[]
  themes: string[]
  languages: string[]
  licensed: boolean
  instantBook: boolean
  priceRange: [number, number]
}

type SortOption = 'featured' | 'rating' | 'price_low' | 'price_high' | 'experience'

function GuidesPage() {
  const searchParams = useSearch({ from: '/guides/' })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState(searchParams.q || '')
  const [sortBy, setSortBy] = useState<SortOption>('featured')

  const [filters, setFilters] = useState<DirectoryFilters>({
    regions: searchParams.region ? [searchParams.region] : [],
    themes: searchParams.theme ? [searchParams.theme] : [],
    languages: [],
    licensed: false,
    instantBook: false,
    priceRange: [0, 1000],
  })

  // Fetch guides from Supabase
  const { data: guides = [], isLoading } = useQuery({
    queryKey: ['guides'],
    queryFn: async () => {
      if (!supabase) return []
      const { data } = await supabase
        .from('guides')
        .select('*')
        .eq('status', 'approved')
        .order('is_featured', { ascending: false })
      return (data || []) as Guide[]
    },
  })

  // Filter guides client-side
  const filteredGuides = useMemo(() => {
    let results = [...guides]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      results = results.filter(
        (guide) =>
          guide.full_name.toLowerCase().includes(q) ||
          guide.bio?.toLowerCase().includes(q) ||
          guide.regions_covered?.some((r) => r.toLowerCase().includes(q)) ||
          guide.tour_types?.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (filters.regions.length) {
      results = results.filter((guide) =>
        guide.regions_covered?.some((r) => filters.regions.includes(r.toLowerCase().replace(' ', '_')))
      )
    }

    if (filters.themes.length) {
      results = results.filter((guide) =>
        guide.specialties?.some((s) => filters.themes.some(t => s.toLowerCase().includes(t.toLowerCase()))) ||
        guide.tour_types?.some((t) => filters.themes.some(f => t.toLowerCase().includes(f.toLowerCase())))
      )
    }

    if (filters.languages.length) {
      results = results.filter((guide) =>
        guide.languages?.some((l) => filters.languages.includes(l))
      )
    }

    if (filters.licensed) {
      results = results.filter((guide) => guide.licensed_guide_number)
    }

    if (filters.instantBook) {
      results = results.filter((guide) => (guide as any).instant_book_enabled)
    }

    // Sort based on selection
    results.sort((a, b) => {
      // Featured always first
      if (a.is_featured !== b.is_featured) return b.is_featured ? 1 : -1

      const priceA = (a.pricing as any)?.hourly || 0
      const priceB = (b.pricing as any)?.hourly || 0

      switch (sortBy) {
        case 'price_low':
          return priceA - priceB
        case 'price_high':
          return priceB - priceA
        case 'experience':
          return (b.years_experience || 0) - (a.years_experience || 0)
        case 'rating':
        default:
          return (b.search_boost_score || 0) - (a.search_boost_score || 0)
      }
    })

    return results
  }, [guides, searchQuery, filters, sortBy])

  const toggleArrayFilter = (key: 'regions' | 'themes' | 'languages', value: string) => {
    setFilters((prev) => {
      const current = prev[key] || []
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [key]: updated }
    })
  }

  const clearFilters = () => {
    setFilters({ regions: [], themes: [], languages: [], licensed: false, instantBook: false, priceRange: [0, 1000] })
    setSearchQuery('')
  }

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'experience', label: 'Most Experienced' },
  ]

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.regions.length) count += filters.regions.length
    if (filters.themes.length) count += filters.themes.length
    if (filters.languages.length) count += filters.languages.length
    if (filters.licensed) count++
    if (filters.instantBook) count++
    return count
  }, [filters])

  if (isLoading) {
    return <PageLoading text="Loading guides..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Find Your Perfect Guide</h1>
          <p className="text-white/70 mb-6 max-w-2xl">
            Browse our curated directory of licensed tour guides. Filter by region, specialty, and more.
          </p>
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, region, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              <FilterSection title="Regions">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allRegions.map((region) => (
                    <label key={region.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.regions.includes(region.slug)}
                        onCheckedChange={() => toggleArrayFilter('regions', region.slug)}
                      />
                      <span className="text-sm text-gray-700">{region.name}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Specialties">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allThemes.map((theme) => (
                    <label key={theme.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.themes.includes(theme.slug)}
                        onCheckedChange={() => toggleArrayFilter('themes', theme.slug)}
                      />
                      <span className="text-sm text-gray-700">{theme.icon} {theme.name}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Languages">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {['English', 'Hebrew', 'Spanish', 'French', 'German', 'Russian', 'Chinese', 'Arabic'].map((lang) => (
                    <label key={lang} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.languages.includes(lang)}
                        onCheckedChange={() => toggleArrayFilter('languages', lang)}
                      />
                      <span className="text-sm text-gray-700">{lang}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Features">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.licensed}
                      onCheckedChange={(checked) => setFilters((f) => ({ ...f, licensed: !!checked }))}
                    />
                    <span className="text-sm text-gray-700">Licensed Guides Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.instantBook}
                      onCheckedChange={(checked) => setFilters((f) => ({ ...f, instantBook: !!checked }))}
                    />
                    <span className="text-sm text-gray-700">Instant Book</span>
                  </label>
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <p className="text-gray-500">
                  <span className="font-medium text-gray-900">{filteredGuides.length}</span> guides found
                </p>
                {activeFilterCount > 0 && (
                  <Badge variant="primary">{activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}</Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {/* Mobile Filters Button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:border-primary hover:text-primary"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1 flex items-center justify-center text-xs font-medium rounded-full bg-primary text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn('p-2 transition-colors', viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary')}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary')}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Pills */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.regions.map((slug) => {
                  const region = allRegions.find((r) => r.slug === slug)
                  return (
                    <button
                      key={slug}
                      onClick={() => toggleArrayFilter('regions', slug)}
                      className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20"
                    >
                      {region?.name} <X className="h-3 w-3" />
                    </button>
                  )
                })}
                {filters.themes.map((slug) => {
                  const theme = allThemes.find((t) => t.slug === slug)
                  return (
                    <button
                      key={slug}
                      onClick={() => toggleArrayFilter('themes', slug)}
                      className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm hover:bg-secondary/20"
                    >
                      {theme?.name} <X className="h-3 w-3" />
                    </button>
                  )
                })}
                {filters.licensed && (
                  <button
                    onClick={() => setFilters((f) => ({ ...f, licensed: false }))}
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200"
                  >
                    Licensed <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {/* Results */}
            {filteredGuides.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No guides found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredGuides.map((guide) => (
                  <GuideListItem key={guide.id} guide={guide} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <MobileFilterDrawer
          filters={filters}
          setFilters={setFilters}
          toggleArrayFilter={toggleArrayFilter}
          clearFilters={clearFilters}
          onClose={() => setIsFilterOpen(false)}
          resultCount={filteredGuides.length}
        />
      )}
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <h3 className="font-medium text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  )
}

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link to={`/guides/${guide.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={guide.photo_url || 'https://via.placeholder.com/400x300?text=Guide'}
            alt={guide.full_name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {guide.is_featured && (
            <Badge variant="gold" className="absolute top-3 left-3">Featured</Badge>
          )}
          {guide.licensed_guide_number && (
            <div className="absolute top-3 right-3 p-1.5 bg-green-500 rounded-full" title="Licensed Guide">
              <Shield className="h-4 w-4 text-white" />
            </div>
          )}
          {(guide as any).instant_book_enabled && (
            <div className="absolute top-3 right-12 p-1.5 bg-accent rounded-full" title="Instant Book">
              <Zap className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
              {guide.full_name}
            </h3>
            {(guide.pricing as any)?.hourly && (
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-primary">${(guide.pricing as any).hourly}</p>
                <p className="text-xs text-gray-400">/hour</p>
              </div>
            )}
          </div>
          {guide.business_name && (
            <p className="text-sm text-gray-500 mt-0.5">{guide.business_name}</p>
          )}
          <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{guide.regions_covered?.slice(0, 2).join(', ') || 'Israel'}</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Rating value={4.8} size="sm" showValue />
            <span className="text-sm text-gray-400">(24)</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {guide.specialties?.slice(0, 3).map((spec) => (
              <Badge key={spec} variant="outline" size="sm">{spec}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 text-sm">
            <span className="text-gray-500">
              {guide.languages?.slice(0, 3).map(getLanguageName).join(', ')}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function GuideListItem({ guide }: { guide: Guide }) {
  return (
    <Link to={`/guides/${guide.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
            <img
              src={guide.photo_url || 'https://via.placeholder.com/400x300?text=Guide'}
              alt={guide.full_name}
              className="w-full h-full object-cover"
            />
            {guide.is_featured && (
              <Badge variant="gold" className="absolute top-3 left-3">Featured</Badge>
            )}
          </div>
          <CardContent className="p-4 sm:p-5 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                  {guide.full_name}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {guide.regions_covered?.slice(0, 2).join(', ') || 'Israel'}
                  </span>
                  {guide.years_experience && (
                    <span>{guide.years_experience} years exp.</span>
                  )}
                  <span>{guide.languages?.slice(0, 2).map(getLanguageName).join(', ')}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                {(guide.pricing as any)?.hourly && (
                  <>
                    <p className="text-xl font-bold text-primary">${(guide.pricing as any).hourly}</p>
                    <p className="text-xs text-gray-400">/hour</p>
                  </>
                )}
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-sm text-gray-400">(24)</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mt-3 line-clamp-2">{guide.bio}</p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {guide.specialties?.slice(0, 4).map((spec) => (
                <Badge key={spec} variant="outline" size="sm">{spec}</Badge>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                {guide.licensed_guide_number && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Licensed</span>
                  </div>
                )}
                {(guide as any).instant_book_enabled && (
                  <div className="flex items-center gap-1 text-accent text-sm">
                    <Zap className="h-4 w-4" />
                    <span className="hidden sm:inline">Instant Book</span>
                  </div>
                )}
              </div>
              <Button size="sm">View Profile</Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}

interface MobileFilterDrawerProps {
  filters: DirectoryFilters
  setFilters: React.Dispatch<React.SetStateAction<DirectoryFilters>>
  toggleArrayFilter: (key: 'regions' | 'themes' | 'languages', value: string) => void
  clearFilters: () => void
  onClose: () => void
  resultCount: number
}

function MobileFilterDrawer({ filters, setFilters, toggleArrayFilter, clearFilters, onClose, resultCount }: MobileFilterDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg text-gray-900">Filters</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <FilterSection title="Regions">
            <div className="space-y-2">
              {allRegions.map((region) => (
                <label key={region.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.regions.includes(region.slug)}
                    onCheckedChange={() => toggleArrayFilter('regions', region.slug)}
                  />
                  <span className="text-sm text-gray-700">{region.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>
          <FilterSection title="Themes">
            <div className="space-y-2">
              {allThemes.map((theme) => (
                <label key={theme.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.themes.includes(theme.slug)}
                    onCheckedChange={() => toggleArrayFilter('themes', theme.slug)}
                  />
                  <span className="text-sm text-gray-700">{theme.icon} {theme.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>
          <FilterSection title="Features">
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.licensed}
                  onCheckedChange={(checked) => setFilters((f) => ({ ...f, licensed: !!checked }))}
                />
                <span className="text-sm text-gray-700">Licensed Guides Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.instantBook}
                  onCheckedChange={(checked) => setFilters((f) => ({ ...f, instantBook: !!checked }))}
                />
                <span className="text-sm text-gray-700">Instant Book</span>
              </label>
            </div>
          </FilterSection>
        </div>
        <div className="p-4 border-t border-gray-200 flex gap-3">
          <Button variant="outline" onClick={clearFilters} className="flex-1">
            Clear all
          </Button>
          <Button onClick={onClose} className="flex-1">
            Show {resultCount} guides
          </Button>
        </div>
      </div>
    </div>
  )
}
