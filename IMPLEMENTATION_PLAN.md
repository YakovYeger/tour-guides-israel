# DI_Tours Design Implementation Plan

## Overview
This document outlines the comprehensive implementation plan for integrating the DI_Tours design into the Tour Guides Israel application.

---

## 🎨 Design System Analysis

### Color Palette (from DI_Tours)
- **Primary**: Deep blue (#1E3A5F) - Authority, trust
- **Secondary**: Rich gold (#C4704A) - Warmth, premium  
- **Accent**: Vibrant teal (#2DD4BF) - Energy, freshness
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)
- **Text Primary**: #1F2937
- **Text Muted**: #6B7280
- **Background**: #F9FAFB
- **Surface**: #FFFFFF
- **Border**: #E5E7EB

### Typography
- **Headings**: `font-heading` (Playfair Display or similar serif)
- **Body**: `font-sans` (Inter)
- **Font Sizes**: Standard Tailwind scale

### Component Patterns
- Rounded corners: `rounded-xl` (12px) and `rounded-2xl` (16px)
- Card shadows: `shadow-sm` to `shadow-lg`
- Hover states: Scale transforms, color shifts
- Animations: Framer Motion for page transitions

---

## 📊 Database Schema Changes Required

### New Tables

```sql
-- Tour Offerings (sample itineraries)
CREATE TABLE tour_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id),
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT CHECK (duration IN ('half', 'full', 'multi')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tour Stops (for itineraries)
CREATE TABLE tour_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_offering_id UUID REFERENCES tour_offerings(id),
  time TEXT,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0
);

-- Pricing Tiers
CREATE TABLE guide_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id),
  duration TEXT CHECK (duration IN ('half', 'full', 'multi')),
  group_size_min INTEGER DEFAULT 1,
  group_size_max INTEGER DEFAULT 10,
  price_per_person DECIMAL(10,2),
  flat_rate DECIMAL(10,2),
  description TEXT
);

-- Bookings (enhanced)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id),
  traveler_id UUID REFERENCES auth.users(id),
  tour_offering_id UUID REFERENCES tour_offerings(id),
  tour_date DATE NOT NULL,
  group_size INTEGER DEFAULT 1,
  duration TEXT CHECK (duration IN ('half', 'full', 'multi')),
  total_price DECIMAL(10,2),
  down_payment DECIMAL(10,2) DEFAULT 100,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  booking_type TEXT CHECK (booking_type IN ('inquiry', 'instant')) DEFAULT 'inquiry',
  cancellation_policy TEXT DEFAULT 'moderate',
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- CRM Leads
CREATE TABLE crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id),
  traveler_name TEXT NOT NULL,
  traveler_email TEXT,
  traveler_phone TEXT,
  source TEXT, -- 'website', 'referral', 'whatsapp', etc.
  stage TEXT CHECK (stage IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')) DEFAULT 'new',
  tour_date DATE,
  group_size INTEGER,
  budget TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Campaigns
CREATE TABLE ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id),
  placement TEXT CHECK (placement IN ('search_featured', 'region_page', 'homepage')),
  status TEXT CHECK (status IN ('active', 'scheduled', 'ended', 'paused')) DEFAULT 'scheduled',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10,2),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guide Verifications
CREATE TABLE guide_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id),
  license_number TEXT,
  document_url TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewer_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Guide FAQ
CREATE TABLE guide_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- Travelers (enhanced profile)
CREATE TABLE traveler_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  preferred_languages TEXT[],
  saved_guides UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Updates to Existing Tables

```sql
-- Add to guides table
ALTER TABLE guides ADD COLUMN IF NOT EXISTS
  cover_image TEXT,
  carousel_images TEXT[],
  is_pro BOOLEAN DEFAULT FALSE,
  instant_book_enabled BOOLEAN DEFAULT FALSE,
  multi_day_available BOOLEAN DEFAULT FALSE,
  cancellation_policy TEXT DEFAULT 'moderate',
  booking_type TEXT DEFAULT 'inquiry',
  color_accent TEXT,
  social_links JSONB,
  packing_list TEXT[],
  accessibility_features TEXT[];
```

---

## 🏗️ Feature Implementation Phases

### Phase 1: Core Infrastructure (Week 1)
- [ ] Update color system and design tokens
- [ ] Port UI components from DI_Tours
- [ ] Run database migrations
- [ ] Update TypeScript types

### Phase 2: Public Pages (Week 1-2)
- [ ] Home page redesign with Featured Guides
- [ ] Guide Directory with advanced filters
- [ ] Guide Profile page with:
  - Photo carousel
  - Pricing tiers display
  - Sample itineraries
  - FAQ section
  - Reviews with photos
  - Booking panel

### Phase 3: Booking System (Week 2)
- [ ] Booking request flow
- [ ] Instant book functionality
- [ ] Date/group size selection
- [ ] Payment integration (Stripe)
- [ ] Booking confirmation emails

### Phase 4: Guide Dashboard (Week 2-3)
- [ ] Dashboard overview with stats
- [ ] Bookings management (accept/decline)
- [ ] Calendar integration
- [ ] Profile editor (enhanced)
- [ ] Pricing configuration
- [ ] Sample itinerary builder

### Phase 5: CRM System (Week 3)
- [ ] Lead pipeline (Kanban board)
- [ ] Lead detail modal
- [ ] Activity timeline
- [ ] Notes & follow-ups
- [ ] Stage management

### Phase 6: Analytics & Ads (Week 3-4)
- [ ] Analytics dashboard
- [ ] Profile views tracking
- [ ] Booking conversion metrics
- [ ] Ad campaign management
- [ ] Ad placement system

### Phase 7: Traveler Features (Week 4)
- [ ] Traveler dashboard
- [ ] Booking history
- [ ] Saved guides
- [ ] Review submission
- [ ] Messaging system

### Phase 8: Admin Panel (Week 4)
- [ ] Guide verification workflow
- [ ] Content moderation
- [ ] User management
- [ ] Platform analytics

### Phase 9: Onboarding & Settings (Week 4-5)
- [ ] Multi-step guide onboarding
- [ ] Settings pages
- [ ] Notification preferences
- [ ] Subscription management

---

## 📁 Component Migration Plan

### UI Components to Port
| DI_Tours Component | Priority | Notes |
|-------------------|----------|-------|
| Button | High | Already have, update variants |
| Card, CardHeader, CardContent | High | Enhanced version |
| Input, Textarea, Select | High | Add variants |
| Modal | High | New component |
| Tabs | High | New component |
| Badge | High | Update variants |
| Avatar | Medium | New component |
| Dropdown | Medium | New component |
| Rating | Medium | New component |
| Skeleton | Medium | Loading states |
| Toast | Medium | Already have context |
| Checkbox | Medium | New component |
| LoadingSpinner | Low | Simple component |
| BannerAd | Low | Ad system |
| AnimatedElements | Low | Framer Motion |

### Page Components to Port
| Page | Priority | Key Features |
|------|----------|--------------|
| Guide Dashboard | High | Stats, calendar, quick actions |
| Guide CRM | High | Kanban pipeline |
| Guide Bookings | High | Booking cards, actions |
| Guide Profile Editor | High | Multi-section form |
| Guide Analytics | Medium | Charts, metrics |
| Guide Ads | Medium | Campaign management |
| Guide Settings | Medium | Tabs with preferences |
| Guide Onboarding | High | Multi-step wizard |
| Public Directory | High | Filters, grid |
| Public Guide Profile | High | Full profile view |
| Booking Panel | High | Date/group selection |
| Traveler Dashboard | Medium | Booking history |
| Admin Verifications | Low | Approval workflow |

---

## 🗄️ Data Structures

### Guide Type (Enhanced)
```typescript
interface Guide {
  id: string;
  userId: string;
  name: string;
  bio: string;
  profilePhoto: string;
  coverImage?: string;
  carouselImages?: string[];
  languages: string[];
  regions: Region[];
  themes: Theme[];
  pricing: PricingTier[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isPro: boolean;
  availability: string[];
  bookingType: 'inquiry' | 'instant';
  cancellationPolicy: 'flexible' | 'moderate' | 'strict';
  instantBookEnabled: boolean;
  multiDayAvailable: boolean;
  accessibilityFeatures?: string[];
  faq?: FAQ[];
  itineraries?: Itinerary[];
  packingList?: string[];
  colorAccent?: string;
  socialLinks?: SocialLinks;
  certifications?: Certification[];
  createdAt: string;
}
```

### Booking Type
```typescript
interface Booking {
  id: string;
  guideId: string;
  travelerId: string;
  tourOfferingId?: string;
  tourDate: string;
  groupSize: number;
  duration: 'half' | 'full' | 'multi';
  totalPrice: number;
  downPayment: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingType: 'inquiry' | 'instant';
  cancellationPolicy: string;
  specialRequests?: string;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}
```

### CRM Lead Type
```typescript
interface Lead {
  id: string;
  guideId: string;
  travelerName: string;
  travelerEmail?: string;
  travelerPhone?: string;
  source: 'website' | 'referral' | 'whatsapp' | 'email' | 'other';
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  tourDate?: string;
  groupSize?: number;
  budget?: string;
  notes?: string;
  activities?: Activity[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 🚀 Implementation Order

1. **Database migrations** - Set up all new tables
2. **Types & hooks** - TypeScript types and data hooks
3. **UI components** - Port from DI_Tours
4. **Public pages** - Directory, Profile, Home
5. **Booking system** - Core booking flow
6. **Guide dashboard** - All dashboard pages
7. **CRM system** - Lead management
8. **Traveler features** - Dashboard, reviews
9. **Admin panel** - Verifications, management
10. **Polish** - Animations, optimizations

---

## 📋 Next Steps

1. Run database migrations
2. Update TypeScript types
3. Port UI components
4. Begin Phase 2 (Public Pages)

