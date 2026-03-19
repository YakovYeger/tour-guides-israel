import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Calendar, Users, Clock, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback, getInitials } from '@/components/ui/avatar'
import { getSupabaseClient } from '@/lib/supabase'
import type { Guide } from '@/types/database'

type ConfirmationSearch = {
  guideId?: string
  date?: string
  groupSize?: number
  duration?: string
  type?: 'inquiry' | 'instant'
}

export const Route = createFileRoute('/booking/confirmation')({
  component: BookingConfirmationPage,
  validateSearch: (search: Record<string, unknown>): ConfirmationSearch => ({
    guideId: search.guideId as string | undefined,
    date: search.date as string | undefined,
    groupSize: search.groupSize ? Number(search.groupSize) : undefined,
    duration: search.duration as string | undefined,
    type: search.type as 'inquiry' | 'instant' | undefined,
  }),
  head: () => ({ meta: [{ title: 'Booking Confirmed | Tour Guides Israel' }] }),
})

const DURATION_LABELS: Record<string, string> = { half: 'Half Day', full: 'Full Day', multi: 'Multi-Day' }

function BookingConfirmationPage() {
  const search = useSearch({ from: '/booking/confirmation' })
  const { guideId, date, groupSize = 2, duration = 'full', type = 'inquiry' } = search

  const { data: guide } = useQuery({
    queryKey: ['guide', guideId],
    queryFn: async () => {
      if (!guideId) return null
      const supabase = getSupabaseClient()
      const { data } = await supabase.from('guides').select('*').eq('id', guideId).single()
      return data as Guide | null
    },
    enabled: !!guideId,
  })

  const bookingDate = date ? new Date(date) : new Date()
  const isInstant = type === 'instant'
  const bookingId = Math.random().toString(36).substring(2, 10).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {isInstant ? 'Booking Confirmed!' : 'Request Sent!'}
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            {isInstant
              ? 'Your tour has been booked. You will receive a confirmation email shortly.'
              : `Your inquiry has been sent to ${guide?.full_name || 'the guide'}. They will respond within 24 hours.`}
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Badge variant={isInstant ? 'success' : 'primary'}>
                {isInstant ? 'Confirmed' : 'Pending Response'}
              </Badge>
              <span className="text-sm text-gray-500">Booking #{bookingId}</span>
            </div>

            {guide && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                <Avatar size="lg">
                  <AvatarImage src={guide.photo_url || undefined} alt={guide.full_name} />
                  <AvatarFallback>{getInitials(guide.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{guide.full_name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {guide.regions_covered?.slice(0, 2).join(', ') || 'Israel'}
                  </p>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-3 gap-6">
              <BookingDetail icon={Calendar} label="Date" value={bookingDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} />
              <BookingDetail icon={Clock} label="Duration" value={DURATION_LABELS[duration] || duration} />
              <BookingDetail icon={Users} label="Group Size" value={`${groupSize} ${groupSize === 1 ? 'person' : 'people'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">What's Next?</h2>
            <div className="space-y-4">
              {!isInstant && <Step num={1} text="The guide will review your request and respond within 24 hours." />}
              <Step num={isInstant ? 1 : 2} text="You'll receive a confirmation email with all the details." />
              <Step num={isInstant ? 2 : 3} text="Meet your guide at the agreed location and enjoy your tour!" />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/guides">Browse More Guides <ArrowRight className="h-4 w-4 ml-2" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function BookingDetail({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-primary/10 rounded-lg"><Icon className="h-5 w-5 text-primary" /></div>
      <div><p className="text-sm text-gray-500">{label}</p><p className="font-medium text-gray-900">{value}</p></div>
    </div>
  )
}

function Step({ num, text }: { num: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-sm font-medium text-primary">{num}</span>
      </div>
      <p className="text-gray-600">{text}</p>
    </div>
  )
}

