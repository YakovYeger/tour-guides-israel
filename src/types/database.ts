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

// ============================================
// New types from DI_Tours design
// ============================================

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type BookingType = 'inquiry' | 'instant'
export type TourDuration = 'half' | 'full' | 'multi'
export type CancellationPolicy = 'flexible' | 'moderate' | 'strict'
export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
export type LeadSource = 'website' | 'referral' | 'whatsapp' | 'email' | 'phone' | 'other'
export type AdPlacement = 'search_featured' | 'region_page' | 'homepage' | 'theme_page'
export type AdStatus = 'active' | 'scheduled' | 'ended' | 'paused'
export type VerificationStatus = 'pending' | 'approved' | 'rejected'

export interface TourOffering {
  id: string
  guide_id: string
  title: string
  description?: string
  duration: TourDuration
  stops?: TourStop[]
  created_at: string
}

export interface TourStop {
  id: string
  tour_offering_id: string
  time?: string
  title: string
  description?: string
  order_index: number
}

export interface GuidePricing {
  id: string
  guide_id: string
  duration: TourDuration
  group_size_min: number
  group_size_max: number
  price_per_person?: number
  flat_rate?: number
  description?: string
  created_at: string
}

export interface Booking {
  id: string
  guide_id: string
  traveler_id?: string
  tour_offering_id?: string
  traveler_name?: string
  traveler_email?: string
  traveler_phone?: string
  tour_date: string
  group_size: number
  duration: TourDuration
  total_price?: number
  down_payment: number
  status: BookingStatus
  booking_type: BookingType
  cancellation_policy: string
  special_requests?: string
  created_at: string
  confirmed_at?: string
  completed_at?: string
  cancelled_at?: string
  // Joined data
  guide?: Guide
  traveler?: TravelerProfile
  tour_offering?: TourOffering
}

export interface CrmLead {
  id: string
  guide_id: string
  traveler_name: string
  traveler_email?: string
  traveler_phone?: string
  source: LeadSource
  stage: LeadStage
  tour_date?: string
  group_size?: number
  budget?: string
  notes?: string
  activities?: CrmActivity[]
  created_at: string
  updated_at: string
}

export interface CrmActivity {
  id: string
  lead_id: string
  type: 'note' | 'email' | 'call' | 'meeting' | 'stage_change'
  description?: string
  created_at: string
}

export interface AdCampaign {
  id: string
  guide_id: string
  name: string
  placement: AdPlacement
  status: AdStatus
  start_date: string
  end_date: string
  budget?: number
  impressions: number
  clicks: number
  created_at: string
}

export interface GuideVerification {
  id: string
  guide_id: string
  license_number?: string
  document_url?: string
  status: VerificationStatus
  reviewer_notes?: string
  submitted_at: string
  reviewed_at?: string
}

export interface GuideFaq {
  id: string
  guide_id: string
  question: string
  answer: string
  order_index: number
  created_at: string
}

export interface TravelerProfile {
  id: string
  user_id: string
  full_name?: string
  avatar_url?: string
  phone?: string
  country?: string
  preferred_languages?: string[]
  saved_guides?: string[]
  created_at: string
  updated_at: string
}

// Extended Guide type with new DI_Tours fields
export interface GuideExtended extends Guide {
  cover_image?: string
  carousel_images?: string[]
  is_pro?: boolean
  instant_book_enabled?: boolean
  multi_day_available?: boolean
  cancellation_policy?: CancellationPolicy
  booking_type?: BookingType
  color_accent?: string
  social_links?: {
    instagram?: string
    facebook?: string
    linkedin?: string
    twitter?: string
    youtube?: string
  }
  packing_list?: string[]
  accessibility_features?: string[]
  // Joined data
  pricing_tiers?: GuidePricing[]
  faqs?: GuideFaq[]
  tour_offerings?: TourOffering[]
  verifications?: GuideVerification[]
}

// Region types from DI_Tours
export interface Region {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

// Theme types from DI_Tours
export interface Theme {
  id: string
  name: string
  slug: string
  icon?: string
  description?: string
}

// Analytics types
export interface GuideAnalytics {
  profile_views: number
  contact_clicks: number
  booking_requests: number
  conversion_rate: number
  avg_rating: number
  total_reviews: number
  revenue_total: number
  revenue_this_month: number
}

