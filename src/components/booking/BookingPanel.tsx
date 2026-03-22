import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Calendar,
  Users,
  Zap,
  MessageSquare,
  ChevronDown,
  Info,
  Shield,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal'
import { cn } from '@/lib/utils'
import { DatePicker } from './DatePicker'
import type { Guide, TourDuration } from '@/types/database'

interface BookingPanelProps {
  guide: Guide
}

const DURATION_LABELS: Record<string, string> = {
  half: 'Half Day',
  full: 'Full Day',
  multi: 'Multi-Day',
}

export function BookingPanel({ guide }: BookingPanelProps) {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [groupSize, setGroupSize] = useState(2)
  const [duration, setDuration] = useState<TourDuration>('full')
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [bookingType, setBookingType] = useState<'inquiry' | 'instant'>('inquiry')

  // Calculate pricing - support both formats
  const pricing = guide.pricing as { hourly?: number; halfDay?: number; fullDay?: number; half_day?: number; full_day?: number } | null
  const basePrice = duration === 'half'
    ? (pricing?.halfDay || pricing?.half_day || 250)
    : duration === 'full'
    ? (pricing?.fullDay || pricing?.full_day || 450)
    : ((pricing?.fullDay || pricing?.full_day || 450) * 2)

  const totalPrice = basePrice
  const downPayment = Math.min(100, Math.round(totalPrice * 0.2)) // 20% or $100, whichever is lower

  const availableDurations = guide.tour_duration_options || ['half', 'full']
  const maxGroupSize = guide.max_group_size || 10

  const handleBooking = (type: 'inquiry' | 'instant') => {
    setBookingType(type)
    setIsConfirmOpen(true)
  }

  const confirmBooking = async () => {
    // In production, this would create a booking in Supabase
    setIsConfirmOpen(false)
    navigate({ to: '/booking/confirmation', search: { 
      guideId: guide.id,
      date: selectedDate?.toISOString(),
      groupSize,
      duration,
      type: bookingType,
    }})
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          {/* Price Header */}
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <span className="text-sm text-gray-500">From</span>
              <span className="text-3xl font-bold text-primary ml-2">${basePrice}</span>
              <span className="text-gray-500">/group</span>
            </div>
            {(guide as any).instant_book_enabled && (
              <Badge variant="success"><Zap className="h-3 w-3 mr-1" />Instant</Badge>
            )}
          </div>

          {/* Duration Selector */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Tour Duration</label>
            <div className="flex gap-2">
              {availableDurations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d as TourDuration)}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all',
                    duration === d
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  {DURATION_LABELS[d] || d}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker Trigger */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Tour Date</label>
            <button
              onClick={() => setIsDatePickerOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                {selectedDate ? (
                  <span className="text-gray-900">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                ) : (
                  <span className="text-gray-400">Select a date</span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Group Size */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Group Size</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                disabled={groupSize <= 1}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span className="text-lg font-semibold text-gray-900">{groupSize}</span>
                  <span className="text-gray-500">{groupSize === 1 ? 'person' : 'people'}</span>
                </div>
              </div>
              <button
                onClick={() => setGroupSize(Math.min(maxGroupSize, groupSize + 1))}
                disabled={groupSize >= maxGroupSize}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Max {maxGroupSize} people</p>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">{DURATION_LABELS[duration]} tour</span>
              <span className="text-gray-900 font-medium">${totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Down payment due now</span>
              <span className="text-gray-900 font-medium">${downPayment}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-primary text-lg">${totalPrice}</span>
            </div>
            <p className="text-sm text-gray-500 mt-4 flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              Remaining ${totalPrice - downPayment} paid directly to guide
            </p>
          </div>

          {/* Booking Buttons */}
          <div className="space-y-3">
            <Button fullWidth size="lg" onClick={() => navigate({ to: `/book/${guide.id}` })} leftIcon={<Zap className="h-5 w-5" />}>
              Book Now
            </Button>
            <Button fullWidth size="lg" variant="outline" onClick={() => handleBooking('inquiry')} leftIcon={<MessageSquare className="h-5 w-5" />}>
              Send Message
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Check className="h-4 w-4 text-green-500" /> Free cancellation up to 48 hours
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4 text-green-500" /> Secure payment
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Picker Modal */}
      <Modal open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <ModalContent>
          <ModalHeader><ModalTitle>Select Tour Date</ModalTitle></ModalHeader>
          <ModalBody>
            <DatePicker selectedDate={selectedDate} onSelect={(date) => { setSelectedDate(date); setIsDatePickerOpen(false) }} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Confirmation Modal */}
      <Modal open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{bookingType === 'instant' ? 'Confirm Your Booking' : 'Send Inquiry'}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img src={guide.photo_url || 'https://via.placeholder.com/64'} alt={guide.full_name} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h4 className="font-semibold text-gray-900">{guide.full_name}</h4>
                  <p className="text-sm text-gray-500">{DURATION_LABELS[duration]} tour • {groupSize} {groupSize === 1 ? 'person' : 'people'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span className="text-gray-900 font-medium">{selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Price</span>
                  <span className="text-gray-900 font-medium">${totalPrice}</span>
                </div>
                {bookingType === 'instant' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Due Now</span>
                    <span className="text-primary font-semibold">${downPayment}</span>
                  </div>
                )}
              </div>
              {bookingType === 'instant' && (
                <p className="text-sm text-gray-500">You will be charged ${downPayment} now. The remaining ${totalPrice - downPayment} is paid directly to the guide.</p>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmBooking}>
              {bookingType === 'instant' ? `Pay $${downPayment} Now` : 'Send Inquiry'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

