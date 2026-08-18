import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Guide, Review, TourOffering, GuidePricing, GuideFaq } from '@/types/database'

// Fetch a single guide by slug — tries custom_profile_url first, then by id.
export function useGuideBySlug(slug: string) {
  return useQuery({
    queryKey: ['guide', slug],
    queryFn: async () => {
      if (!supabase) return null
      const { data: byUrl, error: err1 } = await supabase
        .from('guides')
        .select('*')
        .eq('custom_profile_url', slug)
        .eq('status', 'approved')
        .maybeSingle()

      if (byUrl) return byUrl as Guide

      const { data: byId, error: err2 } = await supabase
        .from('guides')
        .select('*')
        .eq('id', slug)
        .maybeSingle()

      if (err2) throw err2
      return (byId as Guide) || null
    },
    enabled: !!slug,
  })
}

// Published reviews for a guide (newest first).
export function useGuideReviews(guideId: string) {
  return useQuery({
    queryKey: ['guide-reviews', guideId],
    queryFn: async () => {
      if (!supabase) return []
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('guide_id', guideId)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data || []) as Review[]
    },
    enabled: !!guideId,
  })
}

// Tour offerings (sample itineraries) with their stops, ordered.
export function useGuideOfferings(guideId: string) {
  return useQuery({
    queryKey: ['guide-offerings', guideId],
    queryFn: async () => {
      if (!supabase) return []
      const { data, error } = await supabase
        .from('tour_offerings')
        .select('*, tour_stops(*)')
        .eq('guide_id', guideId)
        .order('created_at', { ascending: true })
      if (error) throw error
      // sort stops by order_index
      return (data || []).map((o) => ({
        ...o,
        tour_stops: (o.tour_stops || []).sort((a: any, b: any) => a.order_index - b.order_index),
      })) as (TourOffering & { tour_stops: any[] })[]
    },
    enabled: !!guideId,
  })
}

// Pricing tiers for a guide.
export function useGuidePricing(guideId: string) {
  return useQuery({
    queryKey: ['guide-pricing', guideId],
    queryFn: async () => {
      if (!supabase) return []
      const { data, error } = await supabase
        .from('guide_pricing')
        .select('*')
        .eq('guide_id', guideId)
        .order('flat_rate', { ascending: true })
      if (error) throw error
      return (data || []) as GuidePricing[]
    },
    enabled: !!guideId,
  })
}

// FAQ entries for a guide.
export function useGuideFaqs(guideId: string) {
  return useQuery({
    queryKey: ['guide-faqs', guideId],
    queryFn: async () => {
      if (!supabase) return []
      const { data, error } = await supabase
        .from('guide_faqs')
        .select('*')
        .eq('guide_id', guideId)
        .order('order_index', { ascending: true })
      if (error) throw error
      return (data || []) as GuideFaq[]
    },
    enabled: !!guideId,
  })
}
