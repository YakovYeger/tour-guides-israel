import { createFileRoute, Link } from '@tanstack/react-router'
import { Heart, Users, Award, Globe, MapPin, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/about')({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: 'About Us | Tour Guides Israel' },
      { name: 'description', content: 'Learn about Tour Guides Israel - connecting travelers with licensed professional guides.' },
    ],
  }),
})

function AboutPage() {
  const values = [
    { icon: Award, title: 'Quality First', desc: 'Every guide is licensed and vetted to ensure exceptional experiences.' },
    { icon: Users, title: 'Community', desc: 'We support guides with tools and resources to grow their business.' },
    { icon: Shield, title: 'Trust & Safety', desc: 'Verified credentials, honest reviews, and secure communication.' },
    { icon: Globe, title: 'Accessibility', desc: 'Tours in 15+ languages for visitors from around the world.' },
  ]

  const stats = [
    { value: '150+', label: 'Licensed Guides' },
    { value: '5,000+', label: 'Tours Completed' },
    { value: '15+', label: 'Languages' },
    { value: '4.9', label: 'Average Rating' },
  ]

  return (
    <div className="py-12 md:py-20">
      <div className="page-wrap">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="display-title text-4xl md:text-5xl font-bold text-desert-ink mb-6">
            Connecting Travelers with Israel's Best Guides
          </h1>
          <p className="text-xl text-desert-ink-soft">
            We believe everyone deserves an expert guide who brings Israel's stories to life.
          </p>
        </div>

        {/* Mission */}
        <div className="island-shell rounded-3xl p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sunset/10 text-sunset text-sm font-medium mb-4">
                <Heart className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-desert-ink mb-4">
                Making Every Visit Unforgettable
              </h2>
              <p className="text-desert-ink-soft mb-4">
                Israel is a land of incredible history, diverse cultures, and breathtaking landscapes.
                To truly understand it, you need a guide who can unlock its secrets.
              </p>
              <p className="text-desert-ink-soft">
                We connect travelers with passionate professionals who share the stories, hidden gems,
                and local perspectives that transform a trip into a life-changing experience.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="p-6 rounded-2xl bg-surface text-center">
                  <p className="text-3xl font-bold text-sunset mb-1">{stat.value}</p>
                  <p className="text-sm text-desert-ink-soft">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-desert-ink text-center mb-10">What We Stand For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="island-shell rounded-xl p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-sunset" />
                </div>
                <h3 className="font-semibold text-desert-ink mb-2">{value.title}</h3>
                <p className="text-sm text-desert-ink-soft">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Story */}
        <div className="island-shell rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-desert-ink mb-6">Our Story</h2>
          <div className="space-y-4 text-desert-ink-soft">
            <p>
              Tour Guides Israel was born from a simple observation: finding the right tour guide
              in Israel was surprisingly difficult. Despite the country's rich tourism industry,
              travelers struggled to discover qualified guides who matched their interests.
            </p>
            <p>
              We set out to change that. By building a platform that showcases Israel's incredible
              community of licensed guides, we make it easy for travelers to find their perfect match.
            </p>
            <p>
              Today, we're proud to partner with over 150 licensed guides across Israel, helping thousands
              of visitors discover the country through the eyes of passionate local experts.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-desert-ink mb-4">Ready to Explore?</h2>
          <p className="text-desert-ink-soft mb-6">Find your perfect guide and start planning your adventure.</p>
          <Button size="xl" asChild>
            <Link to="/guides">
              <MapPin className="h-5 w-5 mr-2" />
              Find a Guide
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
