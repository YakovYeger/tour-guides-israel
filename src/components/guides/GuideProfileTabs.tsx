import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Star, MapPin, Languages, Award, Image, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Guide } from '@/types/database'

interface GuideProfileTabsProps {
  guide: Guide
}

type TabId = 'about' | 'services' | 'gallery' | 'reviews'

export function GuideProfileTabs({ guide }: GuideProfileTabsProps) {
  const { t } = useTranslation(['guides', 'common'])
  const [activeTab, setActiveTab] = useState<TabId>('about')

  const tabs = [
    { id: 'about' as TabId, label: t('guides:profile.about'), icon: null },
    { id: 'services' as TabId, label: t('guides:profile.services'), icon: null },
    { id: 'gallery' as TabId, label: t('guides:profile.gallery'), icon: Image },
    { id: 'reviews' as TabId, label: t('guides:profile.reviews'), icon: Star },
  ]

  return (
    <div className="island-shell rounded-2xl overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-line overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'text-sunset border-b-2 border-sunset bg-primary-50/50'
                : 'text-desert-ink-soft hover:text-desert-ink hover:bg-link-bg-hover'
            )}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'about' && <AboutTab guide={guide} />}
        {activeTab === 'services' && <ServicesTab guide={guide} />}
        {activeTab === 'gallery' && <GalleryTab guide={guide} />}
        {activeTab === 'reviews' && <ReviewsTab guide={guide} />}
      </div>
    </div>
  )
}

function AboutTab({ guide }: { guide: Guide }) {
  const { t } = useTranslation(['guides', 'common'])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-desert-ink mb-3">About Me</h3>
        <p className="text-desert-ink-soft whitespace-pre-line">{guide.bio}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-desert-ink mb-3">Why I Became a Tour Guide</h3>
        <p className="text-desert-ink-soft whitespace-pre-line">{guide.why_tour_guide}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-desert-ink mb-3">My Unique Approach</h3>
        <p className="text-desert-ink-soft whitespace-pre-line">{guide.unique_approach}</p>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-lg font-semibold text-desert-ink mb-3 flex items-center gap-2">
          <Languages className="h-5 w-5 text-accent-500" />
          {t('guides:profile.languages')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {guide.languages?.map((lang) => (
            <span key={lang} className="px-3 py-1.5 rounded-lg bg-accent-50 text-accent-700 text-sm">
              {t(`common:languages.${lang}`)}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      {guide.certifications && guide.certifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-desert-ink mb-3 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary-600" />
            {t('guides:profile.certifications')}
          </h3>
          <div className="space-y-2">
            {guide.certifications.map((cert: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-desert-ink-soft">
                <span className="w-2 h-2 rounded-full bg-sunset" />
                {cert.name || cert}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ServicesTab({ guide }: { guide: Guide }) {
  const { t } = useTranslation(['guides', 'common'])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-desert-ink mb-3">Tour Types</h3>
        <div className="flex flex-wrap gap-2">
          {guide.tour_types?.map((type) => (
            <span key={type} className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm border border-primary-200">
              {t(`common:tourTypes.${type}`)}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-desert-ink mb-3 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-sunset" />
          {t('guides:profile.regions')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {guide.regions_covered?.map((region) => (
            <span key={region} className="px-3 py-1.5 rounded-lg bg-earth-100 text-earth-700 text-sm">
              {t(`common:regions.${region}`)}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-desert-ink mb-3">Tour Duration Options</h3>
        <div className="flex flex-wrap gap-2">
          {guide.tour_duration_options?.map((duration) => (
            <span key={duration} className="px-3 py-1.5 rounded-lg bg-accent-50 text-accent-700 text-sm">
              {duration.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function GalleryTab({ guide }: { guide: Guide }) {
  const photos = guide.additional_photos || []

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 text-desert-ink-soft">
        No photos available yet.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo, i) => (
        <div key={i} className="aspect-square rounded-xl overflow-hidden bg-earth-100">
          <img src={photo} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
        </div>
      ))}
    </div>
  )
}

function ReviewsTab({ guide }: { guide: Guide }) {
  // Mock reviews for now
  const reviews = [
    { id: 1, name: 'Sarah M.', rating: 5, date: '2024-01-15', content: 'Amazing tour! Our guide was incredibly knowledgeable and made history come alive.', tourType: 'Historical' },
    { id: 2, name: 'David K.', rating: 5, date: '2024-01-10', content: 'Perfect family tour. The guide was patient with our kids and kept everyone engaged.', tourType: 'Family' },
  ]

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 rounded-xl bg-surface border border-line">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-medium text-desert-ink">{review.name}</p>
              <p className="text-sm text-desert-ink-soft">{review.tourType} Tour</p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn('h-4 w-4', i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-earth-200')} />
              ))}
            </div>
          </div>
          <p className="text-desert-ink-soft">{review.content}</p>
        </div>
      ))}
    </div>
  )
}

