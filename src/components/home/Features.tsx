import { useTranslation } from 'react-i18next'
import { Award, MapPinned, Compass, Languages } from 'lucide-react'

const features = [
  { key: 'licensed', icon: Award },
  { key: 'local', icon: MapPinned },
  { key: 'customized', icon: Compass },
  { key: 'languages', icon: Languages },
]

export function Features() {
  const { t } = useTranslation('home')

  return (
    <section className="py-16 md:py-24">
      <div className="page-wrap">
        <div className="text-center mb-12">
          <h2 className="display-title text-3xl md:text-4xl font-bold text-desert-ink mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-desert-ink-soft max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.key}
                className="feature-card rounded-xl border border-line p-6 transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-sunset" />
                </div>
                <h3 className="text-lg font-semibold text-desert-ink mb-2">
                  {t(`features.${feature.key}.title`)}
                </h3>
                <p className="text-sm text-desert-ink-soft">
                  {t(`features.${feature.key}.description`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

