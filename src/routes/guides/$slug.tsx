import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  MapPin,
  Shield,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Share2,
  Heart,
  Check,
  Zap,
  Award,
  Languages,
  ChevronDown,
  Users,
  Car,
  Calendar,
  Phone,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Rating } from '@/components/ui/rating'
import { Avatar, AvatarImage, AvatarFallback, getInitials } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PageLoading } from '@/components/ui/loading-spinner'
import { cn } from '@/lib/utils'
import { getSupabaseClient } from '@/lib/supabase'
import { getLanguageName } from '@/data'
import type { Guide } from '@/types/database'

export const Route = createFileRoute('/guides/$slug')({
  component: GuideProfilePage,
  head: ({ params }) => ({
    meta: [{ title: `Tour Guide Profile | Tour Guides Israel` }],
  }),
})

function GuideProfilePage() {
  const { slug } = Route.useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContact, setShowContact] = useState(false)

  const { data: guide, isLoading, error } = useQuery({
    queryKey: ['guide', slug],
    queryFn: async () => {
      const supabase = getSupabaseClient()
      const { data } = await supabase
        .from('guides')
        .select('*')
        .eq('id', slug)
        .single()
      return data as Guide | null
    },
  })

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
                  {guide.is_pro && <Badge variant="secondary">Pro Guide</Badge>}
                  {guide.licensed_guide_number && <Badge variant="success"><Shield className="h-3 w-3 mr-1" />Licensed</Badge>}
                </div>
                <div className="flex items-center gap-4 mt-2 text-gray-500 flex-wrap">
                  <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{guide.regions_covered?.join(', ') || 'Israel'}</div>
                  <Rating value={4.8} showValue showCount count={24} size="sm" />
                </div>
                {guide.instant_book_enabled && (
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
                <TabsTrigger value="reviews">Reviews (24)</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <AboutTab guide={guide} />
              </TabsContent>

              <TabsContent value="reviews">
                <ReviewsTab />
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <BookingSidebar guide={guide} showContact={showContact} setShowContact={setShowContact} />
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

function ReviewsTab() {
  const reviews = [
    { id: '1', name: 'Sarah M.', date: '2024-01-15', rating: 5, text: 'Amazing experience! David was so knowledgeable and passionate.', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    { id: '2', name: 'James W.', date: '2024-01-10', rating: 5, text: 'One of the best tours we have ever taken. Highly recommend!', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    { id: '3', name: 'Maria G.', date: '2024-01-05', rating: 4, text: 'Great tour with lots of history. Would book again.', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
  ]

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-6 p-4 bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">4.8</div>
          <Rating value={4.8} size="md" className="mt-1" />
          <div className="text-sm text-gray-500 mt-1">24 reviews</div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar size="md">
                  <AvatarImage src={review.photo} alt={review.name} />
                  <AvatarFallback>{getInitials(review.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
                  </div>
                  <Rating value={review.rating} size="sm" className="mt-1" />
                  <p className="text-gray-600 mt-2">{review.text}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function BookingSidebar({ guide, showContact, setShowContact }: { guide: Guide; showContact: boolean; setShowContact: (v: boolean) => void }) {
  const [selectedDate, setSelectedDate] = useState('')
  const [groupSize, setGroupSize] = useState(2)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="text-sm text-gray-500">Starting from</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">
            ${guide.pricing?.half_day || 350}
            <span className="text-base font-normal text-gray-500"> / half day</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tour Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select value={groupSize} onChange={(e) => setGroupSize(Number(e.target.value))} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Button fullWidth size="lg" className="mb-3">
          {guide.instant_book_enabled ? 'Book Instantly' : 'Request to Book'}
        </Button>

        <Button variant="outline" fullWidth onClick={() => setShowContact(true)}>
          <MessageSquare className="h-4 w-4 mr-2" /> Contact Guide
        </Button>

        {showContact && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
            {guide.email && (
              <a href={`mailto:${guide.email}`} className="flex items-center gap-2 text-primary hover:underline">
                <Mail className="h-4 w-4" /> {guide.email}
              </a>
            )}
            {guide.phone && (
              <a href={`tel:${guide.phone}`} className="flex items-center gap-2 text-primary hover:underline">
                <Phone className="h-4 w-4" /> {guide.phone}
              </a>
            )}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Check className="h-4 w-4 text-green-500" />
            Free cancellation up to 24 hours
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
            <Shield className="h-4 w-4 text-green-500" />
            Licensed & verified guide
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
