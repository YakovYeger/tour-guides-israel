import type { Theme } from '@/types/database'

export const themes: Theme[] = [
  {
    id: 'historical',
    name: 'History & Archaeology',
    slug: 'historical',
    icon: '🏛️',
    description: 'Explore ancient civilizations and archaeological wonders',
  },
  {
    id: 'religious',
    name: 'Religious & Spiritual',
    slug: 'religious',
    icon: '✡️',
    description: 'Sacred sites and spiritual journeys',
  },
  {
    id: 'culinary',
    name: 'Food & Wine',
    slug: 'culinary',
    icon: '🍷',
    description: 'Taste your way through Israel\'s cuisine',
  },
  {
    id: 'adventure',
    name: 'Adventure & Outdoor',
    slug: 'adventure',
    icon: '🥾',
    description: 'Hiking, rappelling, and desert expeditions',
  },
  {
    id: 'nature',
    name: 'Nature & Wildlife',
    slug: 'nature',
    icon: '🌿',
    description: 'Discover Israel\'s diverse ecosystems',
  },
  {
    id: 'family',
    name: 'Family Friendly',
    slug: 'family',
    icon: '👨‍👩‍👧‍👦',
    description: 'Fun and educational tours for all ages',
  },
  {
    id: 'photography',
    name: 'Photography',
    slug: 'photography',
    icon: '📸',
    description: 'Capture stunning landscapes and moments',
  },
  {
    id: 'wine',
    name: 'Wine Tours',
    slug: 'wine',
    icon: '🍇',
    description: 'Visit boutique wineries across the country',
  },
  {
    id: 'architecture',
    name: 'Architecture & Art',
    slug: 'architecture',
    icon: '🎨',
    description: 'From ancient to Bauhaus to modern design',
  },
  {
    id: 'beach',
    name: 'Beach & Sea',
    slug: 'beach',
    icon: '🏖️',
    description: 'Mediterranean coast and Red Sea adventures',
  },
]

export function getThemeBySlug(slug: string): Theme | undefined {
  return themes.find((t) => t.slug === slug)
}

export function getThemeById(id: string): Theme | undefined {
  return themes.find((t) => t.id === id)
}

