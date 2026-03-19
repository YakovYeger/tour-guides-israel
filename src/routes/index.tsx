import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  Shield,
  Star,
  Calendar,
  ArrowRight,
  CheckCircle,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Rating } from '@/components/ui/rating'
import { Avatar, AvatarImage, AvatarFallback, getInitials } from '@/components/ui/avatar'
import { getSupabaseClient } from '@/lib/supabase'
import { regions } from '@/data/regions'
import { themes } from '@/data/themes'
import type { Guide } from '@/types/database'

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => ({
    meta: [
      { title: 'Tour Guides Israel | Find Licensed Tour Guides' },
      { name: 'description', content: 'Find and book licensed tour guides in Israel.' },
    ],
  }),
})

const stats = [
  { label: 'Licensed Guides', value: '200+' },
  { label: 'Happy Travelers', value: '10,000+' },
  { label: 'Tours Completed', value: '25,000+' },
  { label: 'Average Rating', value: '4.9' },
]

const howItWorks = [
  { icon: Search, title: 'Discover', description: 'Browse our curated directory of licensed tour guides.' },
  { icon: Calendar, title: 'Book', description: 'Choose your dates and group size. Book instantly or send an inquiry.' },
  { icon: Star, title: 'Experience', description: 'Meet your guide and enjoy an authentic, personalized tour.' },
]

const testimonials = [
  { name: 'Sarah M.', location: 'New York, USA', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', rating: 5, text: 'Our guide David made Jerusalem come alive!' },
  { name: 'James W.', location: 'London, UK', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', rating: 5, text: 'The food tour was incredible. We learned so much!' },
  { name: 'Maria G.', location: 'Madrid, Spain', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', rating: 5, text: 'Amazing desert adventure. The sunrise was breathtaking.' },
]

function HomePage() {
  const { data: featuredGuides = [] } = useQuery({
    queryKey: ['featured-guides'],
    queryFn: async () => {
      const supabase = getSupabaseClient()
      const { data } = await supabase
        .from('guides')
        .select('*')
        .eq('status', 'approved')
        .eq('is_featured', true)
        .limit(4)
      return (data || []) as Guide[]
    },
  })

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Bar */}
      <StatsSection stats={stats} />

      {/* Featured Guides */}
      <FeaturedGuidesSection guides={featuredGuides} />

      {/* Explore by Region */}
      <RegionsSection />

      {/* How It Works */}
      <HowItWorksSection steps={howItWorks} />

      {/* Explore by Theme */}
      <ThemesSection />

      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* For Guides CTA */}
      <GuideCTASection />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary min-h-[600px] lg:min-h-[700px] flex items-center">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      <div className="container relative z-10 py-16 lg:py-24">
        <div className="max-w-3xl">
          <Badge variant="accent" className="mb-6">
            <Star className="h-3.5 w-3.5 mr-1 fill-current" />
            Rated 4.9/5 by 10,000+ travelers
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Discover Israel with Expert Local Guides
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
            Connect with licensed, passionate guides who bring Israel's history, culture, and hidden gems to life.
          </p>
          <div className="bg-white rounded-2xl p-3 shadow-2xl max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-900 focus:ring-2 focus:ring-primary">
                  <option value="">Where do you want to go?</option>
                  {regions.map((r) => <option key={r.id} value={r.slug}>{r.name}</option>)}
                </select>
              </div>
              <Button size="lg" asChild>
                <Link to="/guides"><Search className="h-5 w-5 mr-2" />Search Guides</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 w-1/2 h-full hidden lg:block z-0">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary" />
        <img src="https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800" alt="Jerusalem" className="h-full w-full object-cover opacity-40" />
      </div>
    </section>
  )
}

function StatsSection({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="container py-14 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-14 lg:gap-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


function FeaturedGuidesSection({ guides }: { guides: Guide[] }) {
  return (
    <section className="py-24 lg:py-36 bg-gray-50">
      <div className="container">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Featured Guides</h2>
            <p className="text-gray-500 mt-4 text-lg">Meet some of our top-rated local experts</p>
          </div>
          <Link to="/guides" className="hidden sm:flex items-center gap-2 text-primary font-medium hover:underline">
            View all guides <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {guides.map((guide) => (
            <Link key={guide.id} to={`/guides/${guide.id}`}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-[4/3]">
                  <img src={guide.photo_url || 'https://via.placeholder.com/400x300'} alt={guide.full_name} className="w-full h-full object-cover" />
                  {guide.is_featured && <Badge variant="secondary" className="absolute top-4 left-4">Featured</Badge>}
                  {guide.licensed_guide_number && <div className="absolute top-4 right-4 p-1.5 bg-green-500 rounded-full"><Shield className="h-4 w-4 text-white" /></div>}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900">{guide.full_name}</h3>
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />{guide.regions_covered?.slice(0, 2).join(', ')}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Rating value={4.8} size="sm" showValue /><span className="text-sm text-gray-500">(24)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {guide.tour_types?.slice(0, 2).map((type) => <Badge key={type} variant="outline" size="sm">{type}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function RegionsSection() {
  return (
    <section className="py-24 lg:py-36">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Explore by Region</h2>
          <p className="text-gray-500 mt-5 text-lg max-w-2xl mx-auto">From ancient Jerusalem to vibrant Tel Aviv</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {regions.slice(0, 8).map((region) => (
            <Link key={region.id} to={`/guides?region=${region.slug}`} className="group relative block aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <img src={region.image} alt={region.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-lg font-semibold text-white">{region.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection({ steps }: { steps: { icon: any; title: string; description: string }[] }) {
  return (
    <section className="py-24 lg:py-36 bg-gray-50">
      <div className="container">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">How It Works</h2>
          <p className="text-gray-500 mt-5 text-lg">Book your perfect tour in three simple steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-14 lg:gap-20 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-2xl bg-primary/10 text-primary mb-7">
                <step.icon className="h-11 w-11" />
              </div>
              <div className="text-sm font-medium text-primary mb-4">Step {index + 1}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ThemesSection() {
  return (
    <section className="py-24 lg:py-36">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Find Your Perfect Experience</h2>
          <p className="text-gray-500 mt-5 text-lg">Choose from a variety of tour themes</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 lg:gap-6 max-w-5xl mx-auto">
          {themes.map((theme) => (
            <Link key={theme.id} to={`/guides?theme=${theme.slug}`} className="px-7 py-4 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-primary hover:text-primary transition-colors shadow-sm">
              <span className="mr-2">{theme.icon}</span>{theme.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection({ testimonials }: { testimonials: { name: string; location: string; image: string; rating: number; text: string }[] }) {
  return (
    <section className="py-24 lg:py-36 bg-gray-50">
      <div className="container">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">What Travelers Say</h2>
          <p className="text-gray-500 mt-5 text-lg">Join thousands of satisfied travelers</p>
        </div>
        <div className="grid md:grid-cols-3 gap-9 lg:gap-12 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <Card key={t.name} className="h-full">
              <CardContent className="p-8">
                <Rating value={t.rating} size="sm" className="mb-6" />
                <p className="text-gray-600 mb-9 leading-relaxed text-lg">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <Avatar size="md"><AvatarImage src={t.image} alt={t.name} /><AvatarFallback>{getInitials(t.name)}</AvatarFallback></Avatar>
                  <div><div className="font-medium text-gray-900">{t.name}</div><div className="text-sm text-gray-500">{t.location}</div></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function GuideCTASection() {
  return (
    <section className="py-28 lg:py-40 bg-secondary/10">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-7">Are You a Tour Guide?</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join Tour Guides Israel and grow your business. Get access to CRM tools, analytics, and connect with travelers from around the world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" asChild><Link to="/for-guides/register">Join as a Guide <ArrowRight className="h-5 w-5 ml-2" /></Link></Button>
            <Button variant="outline" size="lg" asChild><Link to="/for-guides">Learn More</Link></Button>
          </div>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-9 text-sm text-gray-500">
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Free to join</div>
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />No monthly fees</div>
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Pro tools available</div>
          </div>
        </div>
      </div>
    </section>
  )
}
