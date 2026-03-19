import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Check, TrendingUp, Users, Star, Globe } from 'lucide-react'

export const Route = createFileRoute('/for-guides/')({
  component: ForGuidesPage,
  head: () => ({
    meta: [
      { title: 'Become a Tour Guide | Tour Guides Israel' },
      { name: 'description', content: 'Join Israel\'s premier tour guide directory. Get more visibility, connect with travelers, and grow your business.' },
    ],
  }),
})

function ForGuidesPage() {
  const { t } = useTranslation(['guides', 'common'])

  const benefits = [
    { icon: TrendingUp, title: 'Increase Visibility', desc: 'Get found by thousands of travelers searching for guides in Israel' },
    { icon: Users, title: 'Direct Connections', desc: 'Connect directly with travelers - no middleman, no commission' },
    { icon: Star, title: 'Build Your Reputation', desc: 'Collect reviews and showcase your expertise to stand out' },
    { icon: Globe, title: 'Reach Global Audience', desc: 'Your profile is available in multiple languages for international tourists' },
  ]

  const features = [
    'Professional profile page',
    'Photo and video gallery',
    'Availability calendar',
    'Direct messaging',
    'Analytics dashboard',
    'Blog & events',
    'Search optimization',
    'Mobile-friendly',
  ]

  return (
    <div className="py-12 md:py-20">
      <div className="page-wrap">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="display-title text-4xl md:text-5xl font-bold text-desert-ink mb-6">
            {t('guides:registration.title')}
          </h1>
          <p className="text-xl text-desert-ink-soft mb-8">
            {t('guides:registration.subtitle')}
          </p>
          <Button size="xl" asChild>
            <Link to="/for-guides/register">Start Your Free Profile</Link>
          </Button>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="island-shell rounded-xl p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="h-7 w-7 text-sunset" />
              </div>
              <h3 className="font-semibold text-desert-ink mb-2">{benefit.title}</h3>
              <p className="text-sm text-desert-ink-soft">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="island-shell rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-bold text-desert-ink text-center mb-8">
            Everything You Need to Succeed
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-desert-ink-soft">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-desert-ink mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-desert-ink-soft mb-6">
            It only takes 5 minutes to create your profile
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" asChild>
              <Link to="/for-guides/register">Create Your Profile</Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link to="/pricing">View Pricing Plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

