import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from './use-auth'

// Types
export interface Booking {
  id: string
  guide_id: string
  traveler_name: string
  traveler_email: string
  traveler_phone?: string
  tour_date: string
  group_size: number
  duration: string
  total_price: number
  down_payment: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  special_requests?: string
  created_at: string
}

export interface Review {
  id: string
  guide_id: string
  reviewer_name: string
  reviewer_email: string
  rating: number
  title: string
  content: string
  tour_type?: string
  tour_date?: string
  is_verified: boolean
  is_published: boolean
  guide_response?: string
  guide_response_at?: string
  created_at: string
}

// Fetch guide's bookings
export function useBookings() {
  const { guide } = useAuth()
  
  return useQuery({
    queryKey: ['bookings', guide?.id],
    queryFn: async () => {
      if (!supabase || !guide?.id) return []
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('guide_id', guide.id)
        .order('tour_date', { ascending: true })
      if (error) throw error
      return data as Booking[]
    },
    enabled: !!guide?.id,
  })
}

// Fetch guide's reviews
export function useReviews() {
  const { guide } = useAuth()
  
  return useQuery({
    queryKey: ['reviews', guide?.id],
    queryFn: async () => {
      if (!supabase || !guide?.id) return []
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('guide_id', guide.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Review[]
    },
    enabled: !!guide?.id,
  })
}

// Update booking status
export function useUpdateBooking() {
  const queryClient = useQueryClient()
  const { guide } = useAuth()
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!supabase) throw new Error('No supabase client')
      const { error } = await supabase
        .from('bookings')
        .update({ status, confirmed_at: status === 'confirmed' ? new Date().toISOString() : null })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', guide?.id] })
    },
  })
}

// Respond to review
export function useRespondToReview() {
  const queryClient = useQueryClient()
  const { guide } = useAuth()
  
  return useMutation({
    mutationFn: async ({ id, response }: { id: string; response: string }) => {
      if (!supabase) throw new Error('No supabase client')
      const { error } = await supabase
        .from('reviews')
        .update({ guide_response: response, guide_response_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', guide?.id] })
    },
  })
}

// Conversations
export interface Conversation {
  id: string
  guide_id: string
  client_name: string
  client_email: string
  subject: string
  status: string
  last_message_at: string
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_type: 'guide' | 'client'
  content: string
  is_read: boolean
  created_at: string
}

export function useConversations() {
  const { guide } = useAuth()

  return useQuery({
    queryKey: ['conversations', guide?.id],
    queryFn: async () => {
      if (!supabase || !guide?.id) return []
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('guide_id', guide.id)
        .order('last_message_at', { ascending: false })
      if (error) throw error
      return data as Conversation[]
    },
    enabled: !!guide?.id,
  })
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!supabase || !conversationId) return []
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as Message[]
    },
    enabled: !!conversationId,
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      if (!supabase) throw new Error('No supabase client')
      const { error } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, sender_type: 'guide', content, is_read: true })
      if (error) throw error
      // Update last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId)
    },
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

// Dashboard stats
export function useDashboardStats() {
  const { guide } = useAuth()
  
  return useQuery({
    queryKey: ['dashboard-stats', guide?.id],
    queryFn: async () => {
      if (!supabase || !guide?.id) return null
      
      // Get bookings for revenue
      const { data: bookings } = await supabase
        .from('bookings')
        .select('total_price, status, tour_date')
        .eq('guide_id', guide.id)
      
      // Get reviews for rating
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('guide_id', guide.id)
        .eq('is_published', true)
      
      const completedBookings = bookings?.filter(b => b.status === 'completed') || []
      const thisMonthRevenue = completedBookings
        .filter(b => new Date(b.tour_date).getMonth() === new Date().getMonth())
        .reduce((sum, b) => sum + Number(b.total_price), 0)
      
      const avgRating = reviews?.length 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0
      
      return {
        thisMonthRevenue,
        totalBookings: bookings?.length || 0,
        pendingBookings: bookings?.filter(b => b.status === 'pending').length || 0,
        avgRating: avgRating.toFixed(1),
        totalReviews: reviews?.length || 0,
      }
    },
    enabled: !!guide?.id,
  })
}

