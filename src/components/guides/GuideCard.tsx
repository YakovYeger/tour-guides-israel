import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Star, MapPin, Languages, Clock, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Guide } from '@/types/database'

interface GuideCardProps {
  guide: Guide
  featured?: boolean
}

export function GuideCard({ guide, featured = false }: GuideCardProps) {
  const { t } = useTranslation(['guides', 'common'])

  // Calculate average rating (mock for now)
  const rating = 4.8
  const reviewCount = 24

  return (
    <Card className={cn(
      'group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
      featured && 'ring-2 ring-sunset/30'
    )}>
      <div className="relative">
        {/* Guide Photo */}
        <div className="aspect-[4/3] overflow-hidden bg-earth-100">
          {guide.photo_url ? (
            <img
              src={guide.photo_url}
              alt={guide.full_name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
              <span className="text-4xl">🧭</span>
            </div>
          )}
        </div>

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-sunset text-white text-xs font-semibold flex items-center gap-1">
            <Award className="h-3 w-3" />
            {t('guides:card.featured')}
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span className="text-sm font-semibold text-desert-ink">{rating}</span>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Name & Business */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-desert-ink group-hover:text-sunset transition-colors">
            {guide.full_name}
          </h3>
          {guide.business_name && (
            <p className="text-sm text-desert-ink-soft">{guide.business_name}</p>
          )}
        </div>

        {/* Quick Info */}
        <div className="space-y-2 mb-4">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-desert-ink-soft">
            <MapPin className="h-4 w-4 text-sunset" />
            <span>{guide.regions_covered?.slice(0, 2).map(r => t(`common:regions.${r}`)).join(', ')}</span>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-2 text-sm text-desert-ink-soft">
            <Languages className="h-4 w-4 text-accent-500" />
            <span>{guide.languages?.slice(0, 3).map(l => t(`common:languages.${l}`)).join(', ')}</span>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-2 text-sm text-desert-ink-soft">
            <Clock className="h-4 w-4 text-earth-500" />
            <span>{t('guides:card.yearsExp', { years: guide.years_experience })}</span>
          </div>
        </div>

        {/* Tour Types Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {guide.tour_types?.slice(0, 3).map((type) => (
            <span
              key={type}
              className="px-2 py-0.5 text-xs rounded-full bg-primary-50 text-primary-700 border border-primary-200"
            >
              {t(`common:tourTypes.${type}`)}
            </span>
          ))}
          {guide.tour_types?.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-earth-100 text-earth-600">
              +{guide.tour_types.length - 3}
            </span>
          )}
        </div>

        {/* Reviews & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-line">
          <span className="text-sm text-desert-ink-soft">
            {t('guides:card.reviews', { count: reviewCount })}
          </span>
          <Button size="sm" asChild>
            <Link to="/guides/$slug" params={{ slug: guide.custom_profile_url || guide.id }}>
              {t('guides:card.viewProfile')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

