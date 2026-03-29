import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Check, Calendar, MapPin, Loader2, User, Clock, Users, CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getBookingFromSession } from '@/lib/stripe'

export const Route = createFileRoute('/book/success')({
  component: BookingSuccessPage,
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: (search.session_id as string) || '',
  }),
})

interface BookingDetails {
  booking: {
    id: string
    tourDate: string
    duration: string
    groupSize: number
    totalPrice: number
    downPayment: number
    status: string
    travelerName: string
    travelerEmail: string
    specialRequests?: string
    guide: {
      full_name: string
      avatar_url?: string
      location?: string
    }
  }
  paymentStatus: string
  amountPaid: number
}

function BookingSuccessPage() {
  const { session_id } = Route.useSearch()
  const [loading, setLoading] = useState(true)
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBooking() {
      if (!session_id) {
        setLoading(false)
        return
      }

      try {
        const result = await getBookingFromSession({ data: { sessionId: session_id } })
        if ('error' in result) {
          setError(result.error)
        } else {
          setBookingDetails(result as BookingDetails)
        }
      } catch (err) {
        console.error('Error fetching booking:', err)
        setError('Could not load booking details')
      } finally {
        setLoading(false)
      }
    }

    // Small delay to allow webhooks to process
    const timer = setTimeout(fetchBooking, 1500)
    return () => clearTimeout(timer)
  }, [session_id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Confirming your payment...</p>
        </div>
      </div>
    )
  }

  const booking = bookingDetails?.booking

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-lg mx-auto px-4">
        <Card>
          <CardContent className="p-8">
            {/* Success Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-gray-500">
                Your tour has been successfully booked.
              </p>
            </div>

            {/* Booking Details */}
            {booking && (
              <div className="bg-gray-50 rounded-lg p-5 mb-6 space-y-4">
                {/* Guide Info */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  {booking.guide.avatar_url ? (
                    <img
                      src={booking.guide.avatar_url}
                      alt={booking.guide.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{booking.guide.full_name}</p>
                    {booking.guide.location && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {booking.guide.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tour Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium">
                        {booking.tourDate ? format(new Date(booking.tourDate), 'MMM d, yyyy') : 'TBD'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium">
                        {booking.duration === 'half' ? 'Half Day' : 'Full Day'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Group Size</p>
                      <p className="font-medium">{booking.groupSize} people</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Paid</p>
                      <p className="font-medium text-green-600">
                        ${bookingDetails?.amountPaid?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Remaining Balance */}
                {booking.totalPrice > booking.downPayment && (
                  <div className="pt-3 border-t text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Remaining balance (pay on tour day)</span>
                      <span className="font-semibold">
                        ${(booking.totalPrice - booking.downPayment).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status Checklist */}
            <div className="bg-green-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Payment received</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Guide notified</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Confirmation email coming soon</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/guides">Browse More Guides</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>

            {/* Reference */}
            {booking && (
              <p className="text-xs text-gray-400 mt-6 text-center">
                Booking ID: {booking.id.slice(0, 8)}...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

