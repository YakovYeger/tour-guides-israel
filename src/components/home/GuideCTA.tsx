import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { TrendingUp, Calendar, UserCheck } from 'lucide-react'

export function GuideCTA() {
  const { t } = useTranslation('home')

  const benefits = [
    { icon: TrendingUp, key: 'visibility' },
    { icon: Calendar, key: 'bookings' },
    { icon: UserCheck, key: 'profile' },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="page-wrap">
        <div className="island-shell rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-100/50 to-transparent" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent-100/30 rounded-full blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="display-title text-3xl md:text-4xl font-bold text-desert-ink mb-4">
                {t('cta.title')}
              </h2>
              <p className="text-lg text-desert-ink-soft mb-8">
                {t('cta.subtitle')}
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon
                  return (
                    <div key={benefit.key} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sunset/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-sunset" />
                      </div>
                      <span className="text-desert-ink font-medium">
                        {t(`cta.benefits.${benefit.key}`)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <Button size="xl" asChild>
                <Link to="/for-guides">{t('cta.button')}</Link>
              </Button>
            </div>

            {/* Right side illustration placeholder */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-sunset/20 to-accent-300/20 flex items-center justify-center">
                <span className="text-6xl">🧭</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

