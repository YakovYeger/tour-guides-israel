import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  MapPin,
  Shield,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Zap,
  Languages,
  Users,
  Car,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Rating } from '@/components/ui/rating'
import { Avatar, AvatarImage, AvatarFallback, getInitials } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PageLoading } from '@/components/ui/loading-spinner'
import { BookingPanel } from '@/components/booking'
import { cn } from '@/lib/utils'
import { getLanguageName } from '@/data'
import type { Guide } from '@/types/database'
import {
  useGuideBySlug,
  useGuideReviews,
  useGuideOfferings,
  useGuidePricing,
  useGuideFaqs,
} from '@/hooks/use-guide-profile'

export const Route = createFileRoute('/guides/$slug')({
  component: GuideProfilePage,
  head: ({ params }) => ({
    meta: [{ title: `Tour Guide Profile | Tour Guides Israel` }],
  }),
})

function GuideProfilePage() {
  const { slug } = Route.useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { data: guide, isLoading, error } = useGuideBySlug(slug)

  if (isLoading) return <PageLoading text="Loading guide profile..." />

  if (error || !guide) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Guide Not Found</h1>
        <p className="text-gray-500 mb-6">The guide you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/guides">Browse Guides</Link>
        </Button>
      </div>
    )
  }

  const images = guide.additional_photos?.length
    ? [guide.photo_url, ...guide.additional_photos].filter(Boolean) as string[]
    : guide.photo_url ? [guide.photo_url] : []

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Image Carousel */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-900">
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={guide.full_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button key={i} onClick={() => setCurrentImageIndex(i)} className={cn('w-2 h-2 rounded-full', i === currentImageIndex ? 'bg-white' : 'bg-white/50')} />
              ))}
            </div>
          </>
        )}

        {/* Back Button */}
        <Link to="/guides" className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-white/90 rounded-lg shadow-lg hover:bg-white text-sm font-medium">
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2 bg-white/90 rounded-lg shadow-lg hover:bg-white"><Share2 className="h-5 w-5" /></button>
          <button className="p-2 bg-white/90 rounded-lg shadow-lg hover:bg-white"><Heart className="h-5 w-5" /></button>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Guide Header */}
            <div className="flex items-start gap-4 mb-6">
              <Avatar size="xl">
                <AvatarImage src={guide.photo_url || undefined} alt={guide.full_name} />
                <AvatarFallback>{getInitials(guide.full_name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{guide.full_name}</h1>
                  {(guide as any).is_pro && <Badge variant="secondary">Pro Guide</Badge>}
                  {guide.licensed_guide_number && <Badge variant="success"><Shield className="h-3 w-3 mr-1" />Licensed</Badge>}
                </div>
                <div className="flex items-center gap-4 mt-2 text-gray-500 flex-wrap">
                  <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{guide.regions_covered?.join(', ') || 'Israel'}</div>
                  <Rating value={4.8} showValue showCount count={24} size="sm" />
                </div>
                {(guide as any).instant_book_enabled && (
                  <div className="flex items-center gap-2 mt-2 text-success"><Zap className="h-4 w-4" /><span className="text-sm font-medium">Instant booking available</span></div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <QuickStat icon={Star} value="4.8" label="Rating" color="text-accent" />
              <QuickStat icon={MessageSquare} value="24" label="Reviews" color="text-primary" />
              <QuickStat icon={Languages} value={String(guide.languages?.length || 0)} label="Languages" color="text-secondary" />
              <QuickStat icon={Clock} value={`${guide.years_experience || 5}+`} label="Years Exp." color="text-success" />
            </div>

            {/* Tour Types */}
            <div className="flex flex-wrap gap-2 mb-8">
              {guide.tour_types?.map((type) => (
                <Link key={type} to={`/guides?theme=${type.toLowerCase()}`} className="px-4 py-2 bg-primary/5 text-primary rounded-lg hover:bg-primary/10 transition-colors">
                  {type}
                </Link>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about">
              <TabsList className="w-full">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="tours">Tours & Pricing</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <AboutTab guide={guide} />
              </TabsContent>

              <TabsContent value="tours">
                <ToursTab guideId={guide.id} />
              </TabsContent>

              <TabsContent value="reviews">
                <ReviewsTab guideId={guide.id} />
              </TabsContent>

              <TabsContent value="faq">
                <FaqTab guideId={guide.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <BookingPanel guide={guide} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickStat({ icon: Icon, value, label, color }: { icon: any; value: string; label: string; color: string }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <Icon className={cn('h-5 w-5 mx-auto mb-2', color)} />
        <div className="font-semibold text-lg text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </CardContent>
    </Card>
  )
}

function AboutTab({ guide }: { guide: Guide }) {
  return (
    <div className="space-y-8 py-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">About {guide.full_name.split(' ')[0]}</h3>
        <p className="text-gray-600 leading-relaxed">{guide.bio || 'No bio available.'}</p>
      </div>

      {guide.unique_approach && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">My Approach</h3>
          <p className="text-gray-600 leading-relaxed">{guide.unique_approach}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {guide.languages?.map((lang) => (
            <Badge key={lang} variant="outline" size="lg">{getLanguageName(lang)}</Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tour Regions</h3>
        <div className="flex flex-wrap gap-2">
          {guide.regions_covered?.map((region) => (
            <Link key={region} to={`/guides?region=${region.toLowerCase().replace(' ', '-')}`} className="flex items-center gap-2 px-3 py-2 bg-primary/5 text-primary rounded-lg hover:bg-primary/10">
              <MapPin className="h-4 w-4" />{region}
            </Link>
          ))}
        </div>
      </div>

      {guide.has_vehicle && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Car className="h-5 w-5" />{guide.vehicle_type || 'Private vehicle available'}
          </div>
        </div>
      )}

      {guide.max_group_size && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Group Size</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-5 w-5" />Up to {guide.max_group_size} people
          </div>
        </div>
      )}
    </div>
  )
}

const DURATION_LABELS: Record<string, string> = {
  half: 'Half Day',
  full: 'Full Day',
  multi: 'Multi-Day',
}

function ToursTab({ guideId }: { guideId: string }) {
  const { data: offerings = [], isLoading: oLoading } = useGuideOfferings(guideId)
  const { data: pricing = [], isLoading: pLoading } = useGuidePricing(guideId)

  if (oLoading && pLoading) return <div className="py-12 text-center text-gray-500">Loading tours...</div>

  return (
    <div className="space-y-10 py-6">
      {/* Pricing tiers */}
      {pricing.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {pricing.map((tier) => (
              <Card key={tier.id}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{DURATION_LABELS[tier.duration] || tier.duration}</span>
                    <Badge variant="outline" size="sm">{tier.group_size_min}–{tier.group_size_max} guests</Badge>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">${tier.flat_rate ?? tier.price_per_person}</span>
                    {tier.flat_rate ? <span className="text-sm text-gray-400">/ group</span> : <span className="text-sm text-gray-400">/ person</span>}
                  </div>
                  {tier.description && <p className="text-sm text-gray-500 mt-2">{tier.description}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sample itineraries */}
      {offerings.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Itineraries</h3>
          <div className="space-y-4">
            {offerings.map((off) => (
              <Card key={off.id}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <Badge variant="primary" size="sm">{DURATION_LABELS[off.duration] || off.duration}</Badge>
                  </div>
                  <h4 className="text-base font-semibold text-gray-900">{off.title}</h4>
                  {off.description && <p className="text-sm text-gray-600 mt-1">{off.description}</p>}
                  {off.tour_stops?.length > 0 && (
                    <ol className="mt-4 space-y-2 border-l-2 border-gray-100 pl-4">
                      {off.tour_stops.map((stop) => (
                        <li key={stop.id} className="relative">
                          {stop.time && <span className="text-xs font-medium text-primary">{stop.time}</span>}
                          <p className="font-medium text-gray-800">{stop.title}</p>
                          {stop.description && <p className="text-sm text-gray-500">{stop.description}</p>}
                        </li>
                      ))}
                    </ol>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No sample itineraries yet.</p>
      )}
    </div>
  )
}

function ReviewsTab({ guideId }: { guideId: string }) {
  const { data: reviews = [], isLoading } = useGuideReviews(guideId)

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  if (isLoading) return <div className="py-12 text-center text-gray-500">Loading reviews...</div>

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-6 p-4 bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{avg ? avg.toFixed(1) : '—'}</div>
          <Rating value={avg} size="md" className="mt-1" />
          <div className="text-sm text-gray-500 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar size="md">
                    <AvatarFallback>{getInitials(review.reviewer_name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">{review.reviewer_name}</div>
                      <div className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</div>
                    </div>
                    <Rating value={review.rating} size="sm" className="mt-1" />
                    {review.title && <p className="font-medium text-gray-800 mt-2">{review.title}</p>}
                    <p className="text-gray-600 mt-1">{review.content}</p>
                    {review.guide_response && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Guide's response:</p>
                        <p className="text-sm text-gray-600 mt-1">{review.guide_response}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function FaqTab({ guideId }: { guideId: string }) {
  const { data: faqs = [], isLoading } = useGuideFaqs(guideId)
  const [open, setOpen] = useState<number | null>(0)

  if (isLoading) return <div className="py-12 text-center text-gray-500">Loading FAQ...</div>
  if (faqs.length === 0) return <p className="text-gray-500 text-center py-8">No FAQ available.</p>

  return (
    <div className="space-y-3 py-6">
      {faqs.map((faq, i) => (
        <Card key={faq.id}>
          <CardContent className="p-0">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-4 text-left"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <ChevronRight className={cn('h-4 w-4 text-gray-400 flex-shrink-0 transition-transform', open === i && 'rotate-90')} />
            </button>
            {open === i && <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
