import { useQuery } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase'
import type { Guide } from '@/types/database'

export interface GuideFilters {
  regions?: string[]
  tourTypes?: string[]
  languages?: string[]
  search?: string
  sortBy?: 'recommended' | 'rating' | 'experience' | 'reviews'
}

export function useGuides(filters: GuideFilters = {}) {
  return useQuery({
    queryKey: ['guides', filters],
    queryFn: async () => {
      const supabase = getSupabaseClient()
      
      let query = supabase
        .from('guides')
        .select('*')
        .eq('status', 'approved')

      // Apply region filter
      if (filters.regions && filters.regions.length > 0) {
        query = query.overlaps('regions_covered', filters.regions)
      }

      // Apply tour types filter
      if (filters.tourTypes && filters.tourTypes.length > 0) {
        query = query.overlaps('tour_types', filters.tourTypes)
      }

      // Apply languages filter
      if (filters.languages && filters.languages.length > 0) {
        query = query.overlaps('languages', filters.languages)
      }

      // Apply search filter
      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%,business_name.ilike.%${filters.search}%`)
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'experience':
          query = query.order('years_experience', { ascending: false })
          break
        case 'reviews':
          query = query.order('profile_views_count', { ascending: false })
          break
        case 'recommended':
        default:
          query = query
            .order('search_boost_score', { ascending: false })
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false })
          break
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data as Guide[]
    },
  })
}

export function useFeaturedGuides(limit: number = 6) {
  return useQuery({
    queryKey: ['guides', 'featured', limit],
    queryFn: async () => {
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('status', 'approved')
        .eq('is_featured', true)
        .order('search_boost_score', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return data as Guide[]
    },
  })
}

export function useGuide(slug: string) {
  return useQuery({
    queryKey: ['guide', slug],
    queryFn: async () => {
      const supabase = getSupabaseClient()
      
      // Try to find by custom URL first, then by ID
      let { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('custom_profile_url', slug)
        .eq('status', 'approved')
        .single()

      // If not found by custom URL, try by ID
      if (error || !data) {
        const result = await supabase
          .from('guides')
          .select('*')
          .eq('id', slug)
          .eq('status', 'approved')
          .single()
        
        data = result.data
        error = result.error
      }

      if (error) {
        throw error
      }

      return data as Guide
    },
    enabled: !!slug,
  })
}

