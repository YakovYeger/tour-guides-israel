import { useTranslation } from 'react-i18next'
import { Search, MessageCircle, Compass } from 'lucide-react'

const steps = [
  { key: 'step1', icon: Search, number: '01' },
  { key: 'step2', icon: MessageCircle, number: '02' },
  { key: 'step3', icon: Compass, number: '03' },
]

export function HowItWorks() {
  const { t } = useTranslation('home')

  return (
    <section className="py-16 md:py-24 bg-sand/30">
      <div className="page-wrap">
        <div className="text-center mb-12">
          <h2 className="display-title text-3xl md:text-4xl font-bold text-desert-ink mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg text-desert-ink-soft max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.key} className="relative text-center">
                {/* Connector line (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-sunset/30 to-transparent" />
                )}

                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-surface-strong border border-line flex items-center justify-center shadow-sm">
                    <Icon className="h-7 w-7 text-sunset" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-sunset text-white text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-desert-ink mb-3">
                  {t(`howItWorks.${step.key}.title`)}
                </h3>
                <p className="text-desert-ink-soft">
                  {t(`howItWorks.${step.key}.description`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

