import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ChevronLeft, Check, CreditCard, Shield, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { createCheckoutSession } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { cn } from '@/lib/utils'
import type { Guide } from '@/types/database'

export const Route = createFileRoute('/book/$guideId')({
  component: BookingPage,
})

type BookingStep = 'details' | 'contact' | 'payment' | 'confirm'

function BookingPage() {
  const { guideId } = Route.useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState<BookingStep>('details')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [duration, setDuration] = useState<'half' | 'full'>('full')
  const [groupSize, setGroupSize] = useState(2)
  const [specialRequests, setSpecialRequests] = useState('')
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' })

  const { data: guide, isLoading } = useQuery({
    queryKey: ['guide', guideId],
    queryFn: async () => {
      if (!supabase) return null
      const { data } = await supabase.from('guides').select('*').eq('id', guideId).single()
      return data as Guide | null
    },
  })

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  if (!guide) return <div className="min-h-screen flex items-center justify-center"><p>Guide not found</p></div>

  // Support both camelCase and snake_case pricing formats
  const pricing = guide.pricing as { hourly?: number; halfDay?: number; fullDay?: number; half_day?: number; full_day?: number } | null
  const halfDayPrice = pricing?.halfDay || pricing?.half_day || 250
  const fullDayPrice = pricing?.fullDay || pricing?.full_day || 450
  const basePrice = duration === 'half' ? halfDayPrice : fullDayPrice
  const downPayment = Math.min(100, Math.round(basePrice * 0.2))

  const handleSubmit = async () => {
    if (!supabase || !selectedDate) return
    setIsSubmitting(true)

    // First create the booking in our database
    const tourDate = format(selectedDate, 'yyyy-MM-dd')
    const { data: booking, error } = await supabase.from('bookings').insert({
      guide_id: guideId, traveler_name: contactInfo.name, traveler_email: contactInfo.email,
      traveler_phone: contactInfo.phone, tour_date: tourDate,
      duration, group_size: groupSize, special_requests: specialRequests,
      total_price: basePrice, down_payment: downPayment, status: 'pending',
    }).select().single()

    if (error || !booking) {
      console.error('Failed to create booking:', error)
      setIsSubmitting(false)
      return
    }

    // Create Stripe Checkout Session via server function
    try {
      const result = await createCheckoutSession({
        data: {
          bookingId: booking.id,
          guideId,
          guideName: guide.full_name,
          amount: downPayment,
          travelerEmail: contactInfo.email,
          tourDate,
          duration,
        },
      })

      if (result.url) {
        window.location.href = result.url // Redirect to Stripe Checkout
      } else {
        console.error('No checkout URL returned:', result)
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setIsSubmitting(false)
    }
  }

  const steps = [{ id: 'details', label: 'Details' }, { id: 'contact', label: 'Contact' }, { id: 'payment', label: 'Payment' }]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <Link to={`/guides/${guideId}`} className="inline-flex items-center text-gray-500 hover:text-primary mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to profile
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Book a Tour with {guide.full_name}</h1>
        </div>

        {step === 'confirm' ? (
          <Card><CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="h-8 w-8 text-green-600" /></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Request Sent!</h2>
            <p className="text-gray-500 mb-6">{guide.full_name} will review and respond within 24 hours.</p>
            <Button onClick={() => navigate({ to: '/' })}>Back to Home</Button>
          </CardContent></Card>
        ) : (
          <>
            <div className="flex items-center justify-center mb-8">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    step === s.id ? 'bg-primary text-white' : steps.findIndex(x => x.id === step) > i ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  )}>{steps.findIndex(x => x.id === step) > i ? <Check className="h-4 w-4" /> : i + 1}</div>
                  <span className={cn('ml-2 text-sm hidden sm:inline', step === s.id ? 'text-primary font-medium' : 'text-gray-500')}>{s.label}</span>
                  {i < steps.length - 1 && <div className="w-8 sm:w-12 h-0.5 bg-gray-200 mx-2" />}
                </div>
              ))}
            </div>
            <Card><CardContent className="p-6">
              {step === 'details' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Tour Details</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <DatePicker
                      date={selectedDate}
                      onDateChange={setSelectedDate}
                      minDate={new Date()}
                      placeholder="Choose your tour date"
                    />
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ v: 'half', l: 'Half Day', d: '4-5 hours', price: halfDayPrice }, { v: 'full', l: 'Full Day', d: '8-10 hours', price: fullDayPrice }].map((o) => (
                        <button key={o.v} onClick={() => setDuration(o.v as 'half' | 'full')} className={cn('p-4 rounded-lg border-2 text-left transition-all', duration === o.v ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300')}>
                          <p className={cn('font-medium', duration === o.v ? 'text-primary' : 'text-gray-700')}>{o.l}</p>
                          <p className="text-sm text-gray-500">{o.d}</p>
                          <p className={cn('text-lg font-bold mt-1', duration === o.v ? 'text-primary' : 'text-gray-900')}>${o.price}</p>
                        </button>
                      ))}
                    </div></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Group Size</label>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setGroupSize(Math.max(1, groupSize - 1))} className="w-10 h-10 rounded-lg border flex items-center justify-center text-lg">-</button>
                      <span className="text-xl font-medium w-12 text-center">{groupSize}</span>
                      <button onClick={() => setGroupSize(Math.min(guide.max_group_size || 10, groupSize + 1))} className="w-10 h-10 rounded-lg border flex items-center justify-center text-lg">+</button>
                    </div></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                    <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg" placeholder="Dietary needs, accessibility..." /></div>
                  <Button onClick={() => setStep('contact')} disabled={!selectedDate} className="w-full">Continue</Button>
                </div>
              )}
              {step === 'contact' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                  <Input label="Full Name" value={contactInfo.name} onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })} />
                  <Input label="Email" type="email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} />
                  <Input label="Phone" type="tel" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep('details')} className="flex-1">Back</Button>
                    <Button onClick={() => setStep('payment')} disabled={!contactInfo.name || !contactInfo.email} className="flex-1">Continue</Button>
                  </div>
                </div>
              )}
              {step === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Review & Pay</h2>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between"><span className="text-gray-500">Guide</span><span className="font-medium">{guide.full_name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{selectedDate ? format(selectedDate, 'PPP') : '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{duration === 'half' ? 'Half Day' : 'Full Day'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Group Size</span><span className="font-medium">{groupSize} people</span></div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between"><span className="text-gray-500">Tour Price</span><span className="font-medium">${basePrice}</span></div>
                      <div className="flex justify-between text-primary font-bold mt-1"><span>Due Now (Deposit)</span><span>${downPayment}</span></div>
                      <div className="flex justify-between text-sm text-gray-400 mt-1"><span>Pay to Guide Later</span><span>${basePrice - downPayment}</span></div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">Secure Payment via Stripe</p>
                      <p>Your card details are handled securely by Stripe. Full refund if guide doesn't confirm.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep('contact')} className="flex-1">Back</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                      Pay ${downPayment} with Stripe
                    </Button>
                  </div>
                </div>
              )}
            </CardContent></Card>
          </>
        )}
      </div>
    </div>
  )
}

