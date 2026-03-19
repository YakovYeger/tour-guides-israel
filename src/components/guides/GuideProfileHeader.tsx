import { useTranslation } from 'react-i18next'
import { Star, MapPin, Clock, Award, Car, Users } from 'lucide-react'
import type { Guide } from '@/types/database'

interface GuideProfileHeaderProps {
  guide: Guide
}

export function GuideProfileHeader({ guide }: GuideProfileHeaderProps) {
  const { t } = useTranslation(['guides', 'common'])
  
  // Mock rating
  const rating = 4.8
  const reviewCount = 24

  return (
    <div className="island-shell rounded-2xl overflow-hidden">
      {/* Cover / Photo */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-primary-200 to-accent-200">
        {guide.additional_photos?.[0] && (
          <img
            src={guide.additional_photos[0]}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        {guide.is_featured && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-sunset text-white text-sm font-semibold flex items-center gap-1.5">
            <Award className="h-4 w-4" />
            Featured Guide
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
            {guide.photo_url ? (
              <img
                src={guide.photo_url}
                alt={guide.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
                <span className="text-5xl">🧭</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="pt-20 md:pt-6 md:ml-40">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-desert-ink mb-1">
                {guide.full_name}
              </h1>
              {guide.business_name && (
                <p className="text-lg text-desert-ink-soft">{guide.business_name}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-desert-ink">{rating}</span>
              <span className="text-desert-ink-soft">({reviewCount} reviews)</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 text-desert-ink-soft">
              <MapPin className="h-4 w-4 text-sunset" />
              <span>{guide.regions_covered?.slice(0, 2).map(r => t(`common:regions.${r}`)).join(', ')}</span>
            </div>
            <div className="flex items-center gap-2 text-desert-ink-soft">
              <Clock className="h-4 w-4 text-accent-500" />
              <span>{t('guides:profile.yearsExperience', { years: guide.years_experience })}</span>
            </div>
            {guide.max_group_size && (
              <div className="flex items-center gap-2 text-desert-ink-soft">
                <Users className="h-4 w-4 text-earth-500" />
                <span>{t('guides:profile.maxGroupSize', { size: guide.max_group_size })}</span>
              </div>
            )}
            {guide.has_vehicle && (
              <div className="flex items-center gap-2 text-desert-ink-soft">
                <Car className="h-4 w-4 text-primary-600" />
                <span>{t('guides:profile.hasVehicle')}</span>
              </div>
            )}
          </div>

          {/* Tour Types */}
          <div className="flex flex-wrap gap-2 mt-4">
            {guide.tour_types?.map((type) => (
              <span
                key={type}
                className="px-3 py-1 text-sm rounded-full bg-primary-50 text-primary-700 border border-primary-200"
              >
                {t(`common:tourTypes.${type}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

