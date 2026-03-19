import { createFileRoute, Link } from '@tanstack/react-router'
import { Check, Sparkles, Star, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: 'Pricing | Tour Guides Israel' },
      { name: 'description', content: 'Choose the right plan to grow your tour guide business in Israel.' },
    ],
  }),
})

const plans = [
  {
    name: 'Free',
    price: '₪0',
    period: 'forever',
    description: 'Get started and see how it works',
    icon: Star,
    features: [
      'Basic profile listing',
      'Up to 3 photos',
      'Contact form',
      'Search visibility',
      'Basic analytics',
    ],
    cta: 'Get Started',
    href: '/for-guides/register',
    popular: false,
  },
  {
    name: 'Supporter',
    price: '₪49',
    period: '/month',
    description: 'For guides ready to grow',
    icon: Sparkles,
    features: [
      'Everything in Free, plus:',
      'Priority search placement',
      'Up to 10 photos + video',
      'Availability calendar',
      'Direct messaging',
      'Review management',
      'Custom profile URL',
      'Advanced analytics',
    ],
    cta: 'Start Free Trial',
    href: '/for-guides/register?plan=supporter',
    popular: true,
  },
  {
    name: 'Pro',
    price: '₪99',
    period: '/month',
    description: 'Maximum visibility & features',
    icon: Zap,
    features: [
      'Everything in Supporter, plus:',
      'Featured guide badge',
      'Top search placement',
      'Unlimited photos & videos',
      'Blog & events posting',
      'Social media integration',
      'Priority support',
      'Booking integrations',
    ],
    cta: 'Start Free Trial',
    href: '/for-guides/register?plan=pro',
    popular: false,
  },
]

function PricingPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="page-wrap">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="display-title text-4xl md:text-5xl font-bold text-desert-ink mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-desert-ink-soft">
            Choose the plan that fits your business. Start free and upgrade as you grow.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card key={plan.name} className={cn(
              'relative',
              plan.popular && 'border-sunset shadow-lg scale-105'
            )}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-sunset text-white text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3',
                  plan.popular ? 'bg-sunset text-white' : 'bg-primary-100 text-sunset'
                )}>
                  <plan.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-desert-ink">{plan.price}</span>
                  <span className="text-desert-ink-soft">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className={cn('h-4 w-4 mt-0.5 flex-shrink-0', i === 0 && plan.name !== 'Free' ? 'text-sunset' : 'text-green-500')} />
                      <span className={cn(i === 0 && plan.name !== 'Free' ? 'font-medium text-desert-ink' : 'text-desert-ink-soft')}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} asChild>
                  <Link to={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-desert-ink text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I switch plans later?', a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.' },
              { q: 'Is there a free trial?', a: 'Yes, both Supporter and Pro plans come with a 14-day free trial. No credit card required to start.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards and PayPal. Payments are processed securely through Stripe.' },
              { q: 'Can I cancel anytime?', a: 'Absolutely. You can cancel your subscription at any time. Your profile will remain active until the end of your billing period.' },
            ].map((faq, i) => (
              <div key={i} className="island-shell rounded-xl p-5">
                <h3 className="font-semibold text-desert-ink mb-2">{faq.q}</h3>
                <p className="text-sm text-desert-ink-soft">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

