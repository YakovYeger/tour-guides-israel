import { createServerFn } from '@tanstack/react-start'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

interface CheckoutData {
  bookingId: string
  guideId: string
  guideName: string
  amount: number
  travelerEmail: string
  tourDate: string
  duration: string
}

// Get booking details from Stripe session
export const getBookingFromSession = createServerFn({ method: 'GET' })
  .inputValidator((data: { sessionId: string }) => data)
  .handler(async ({ data }) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
    )

    // Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(data.sessionId)

    if (!session.metadata?.bookingId) {
      return { error: 'Booking not found' }
    }

    // Get booking details from Supabase
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        guide:guides(full_name, avatar_url, location)
      `)
      .eq('id', session.metadata.bookingId)
      .single()

    if (error || !booking) {
      return { error: 'Booking not found' }
    }

    return {
      booking: {
        id: booking.id,
        tourDate: booking.tour_date,
        duration: booking.duration,
        groupSize: booking.group_size,
        totalPrice: booking.total_price,
        downPayment: booking.down_payment,
        status: booking.status,
        travelerName: booking.traveler_name,
        travelerEmail: booking.traveler_email,
        specialRequests: booking.special_requests,
        guide: booking.guide,
      },
      paymentStatus: session.payment_status,
      amountPaid: session.amount_total ? session.amount_total / 100 : 0,
    }
  })

export const createCheckoutSession = createServerFn({ method: 'POST' })
  .inputValidator((data: CheckoutData) => data)
  .handler(async ({ data }) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
    )
    const appUrl = process.env.APP_URL || process.env.VITE_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: data.travelerEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Tour Deposit - ${data.guideName}`,
              description: `${data.duration === 'half' ? 'Half Day' : 'Full Day'} Tour on ${data.tourDate}`,
            },
            unit_amount: Math.round(data.amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: data.bookingId,
        guideId: data.guideId,
      },
      success_url: `${appUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/book/${data.guideId}?cancelled=true`,
    })

    // Update booking with session ID
    await supabase
      .from('bookings')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', data.bookingId)

    return { url: session.url }
  })

