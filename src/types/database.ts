export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type GuideStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
export type MembershipTier = 'free' | 'supporter' | 'pro'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'canceled'
export type PaymentType = 'subscription' | 'one_time'
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'expired' | 'trialing'

export interface Database {
  public: {
    Tables: {
      guides: {
        Row: {
          id: string
          user_id: string | null
          full_name: string
          email: string
          phone: string
          pronouns: string | null
          photo_url: string | null
          business_name: string | null
          business_logo_url: string | null
          bio: string
          years_experience: number
          languages: string[]
          certifications: Json[] | null
          tour_types: string[]
          regions_covered: string[]
          specialties: string[]
          max_group_size: number
          has_vehicle: boolean
          vehicle_type: string | null
          tour_duration_options: string[]
          licensed_guide_number: string | null
          location: Json
          pricing: Json
          availability: Json
          show_public_availability: boolean
          unique_approach: string
          why_tour_guide: string
          additional_notes: string | null
          additional_photos: string[]
          video_url: string | null
          website: string | null
          social_media: Json | null
          custom_profile_url: string | null
          custom_colors: Json | null
          display_contact_info: string
          display_preferences: string[]
          preferred_contact: string
          consent_display: boolean
          consent_contact: boolean
          status: GuideStatus
          is_featured: boolean
          search_boost_score: number
          profile_views_count: number
          contact_views_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['guides']['Row'], 
          'id' | 'created_at' | 'updated_at' | 'profile_views_count' | 'contact_views_count' | 'search_boost_score' | 'is_featured'>
        Update: Partial<Database['public']['Tables']['guides']['Insert']>
      }
      guide_availability: {
        Row: {
          id: string
          guide_id: string
          date: string
          start_time: string | null
          end_time: string | null
          is_available: boolean
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['guide_availability']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['guide_availability']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          guide_id: string
          reviewer_name: string
          reviewer_email: string | null
          rating: number
          title: string | null
          content: string
          tour_type: string | null
          tour_date: string | null
          is_verified: boolean
          is_published: boolean
          guide_response: string | null
          guide_response_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      user_memberships: {
        Row: {
          id: string
          user_id: string
          guide_id: string | null
          tier: MembershipTier
          status: SubscriptionStatus
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_memberships']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_memberships']['Insert']>
      }
    }
    Views: {
      random_guides: {
        Row: Database['public']['Tables']['guides']['Row']
      }
    }
    Functions: {
      increment_profile_view_count: {
        Args: { p_guide_id: string }
        Returns: void
      }
      increment_contact_view_count: {
        Args: { p_guide_id: string }
        Returns: void
      }
    }
  }
}

export type Guide = Database['public']['Tables']['guides']['Row']
export type GuideInsert = Database['public']['Tables']['guides']['Insert']
export type Review = Database['public']['Tables']['reviews']['Row']
export type UserMembership = Database['public']['Tables']['user_memberships']['Row']

