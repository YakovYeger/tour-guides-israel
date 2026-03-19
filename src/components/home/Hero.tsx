import { useTranslation } from 'react-i18next'
import { Search, Star, Users, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from '@tanstack/react-router'

export function Hero() {
  const { t } = useTranslation('home')

  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />
      </div>

      <div className="page-wrap">
        <div className="max-w-4xl mx-auto text-center">
          {/* Kicker */}
          <div className="island-kicker mb-4">Licensed Tour Guides</div>

          {/* Title */}
          <h1 className="display-title text-4xl md:text-5xl lg:text-6xl font-bold text-desert-ink mb-6 rise-in">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-desert-ink-soft max-w-2xl mx-auto mb-10 rise-in" style={{ animationDelay: '100ms' }}>
            {t('hero.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="island-shell rounded-2xl p-2 max-w-xl mx-auto mb-12 rise-in" style={{ animationDelay: '200ms' }}>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-desert-ink-soft" />
                <Input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0"
                />
              </div>
              <Button size="lg" className="gap-2" asChild>
                <Link to="/guides">
                  <Search className="h-5 w-5" />
                  {t('hero.cta')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto rise-in" style={{ animationDelay: '300ms' }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-5 w-5 text-sunset" />
                <span className="text-2xl md:text-3xl font-bold text-desert-ink">150+</span>
              </div>
              <p className="text-xs md:text-sm text-desert-ink-soft">{t('hero.stats.guides')}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MapPin className="h-5 w-5 text-sunset" />
                <span className="text-2xl md:text-3xl font-bold text-desert-ink">5K+</span>
              </div>
              <p className="text-xs md:text-sm text-desert-ink-soft">{t('hero.stats.tours')}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-5 w-5 text-sunset fill-sunset" />
                <span className="text-2xl md:text-3xl font-bold text-desert-ink">4.9</span>
              </div>
              <p className="text-xs md:text-sm text-desert-ink-soft">{t('hero.stats.rating')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

