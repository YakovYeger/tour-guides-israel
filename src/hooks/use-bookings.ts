import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase'
import type { Booking, TourDuration, BookingStatus } from '@/types/database'

interface CreateBookingParams {
  guideId: string
  tourDate: string
  groupSize: number
  duration: TourDuration
  travelerName: string
  travelerEmail: string
  travelerPhone?: string
  totalPrice?: number
  specialRequests?: string
  bookingType: 'inquiry' | 'instant'
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: CreateBookingParams) => {
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          guide_id: params.guideId,
          tour_date: params.tourDate,
          group_size: params.groupSize,
          duration: params.duration,
          traveler_name: params.travelerName,
          traveler_email: params.travelerEmail,
          traveler_phone: params.travelerPhone,
          total_price: params.totalPrice,
          special_requests: params.specialRequests,
          booking_type: params.bookingType,
          status: params.bookingType === 'instant' ? 'confirmed' : 'pending',
          down_payment: 100,
        })
        .select()
        .single()

      if (error) throw error
      return data as Booking
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export function useGuideBookings(guideId: string, status?: BookingStatus) {
  return useQuery({
    queryKey: ['bookings', 'guide', guideId, status],
    queryFn: async () => {
      const supabase = getSupabaseClient()
      let query = supabase
        .from('bookings')
        .select('*')
        .eq('guide_id', guideId)
        .order('tour_date', { ascending: true })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Booking[]
    },
    enabled: !!guideId,
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: BookingStatus }) => {
      const supabase = getSupabaseClient()
      
      const updates: Record<string, any> = { status }
      
      if (status === 'confirmed') {
        updates.confirmed_at = new Date().toISOString()
      } else if (status === 'completed') {
        updates.completed_at = new Date().toISOString()
      } else if (status === 'cancelled') {
        updates.cancelled_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .select()
        .single()

      if (error) throw error
      return data as Booking
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('bookings')
        .select('*, guide:guides(*)')
        .eq('id', bookingId)
        .single()

      if (error) throw error
      return data as Booking
    },
    enabled: !!bookingId,
  })
}

