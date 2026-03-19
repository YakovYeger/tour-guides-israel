import type { Region } from '@/types/database'

export const regions: Region[] = [
  {
    id: 'jerusalem',
    name: 'Jerusalem',
    slug: 'jerusalem',
    description: 'The Holy City - sacred to three faiths with 3,000 years of history',
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800',
  },
  {
    id: 'tel-aviv',
    name: 'Tel Aviv',
    slug: 'tel-aviv',
    description: 'The White City - Mediterranean vibes, beaches, and modern culture',
    image: 'https://images.unsplash.com/photo-1544628407-0d59c2f36c50?w=800',
  },
  {
    id: 'haifa',
    name: 'Haifa & Carmel',
    slug: 'haifa',
    description: 'The port city with stunning Bahá\'í Gardens and mountain trails',
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800',
  },
  {
    id: 'galilee',
    name: 'Galilee',
    slug: 'galilee',
    description: 'Rolling hills, ancient ruins, and the Sea of Galilee',
    image: 'https://images.unsplash.com/photo-1580228840639-f7a3f24c1d15?w=800',
  },
  {
    id: 'negev',
    name: 'Negev Desert',
    slug: 'negev',
    description: 'Vast desert landscapes, Bedouin culture, and stargazing',
    image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800',
  },
  {
    id: 'dead-sea',
    name: 'Dead Sea',
    slug: 'dead-sea',
    description: 'The lowest point on Earth with healing waters and Masada',
    image: 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=800',
  },
  {
    id: 'eilat',
    name: 'Eilat & Red Sea',
    slug: 'eilat',
    description: 'Coral reefs, desert adventures, and year-round sunshine',
    image: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800',
  },
  {
    id: 'golan',
    name: 'Golan Heights',
    slug: 'golan',
    description: 'Volcanic landscape, wineries, and nature reserves',
    image: 'https://images.unsplash.com/photo-1591623271914-15ef43cdc3eb?w=800',
  },
]

export function getRegionBySlug(slug: string): Region | undefined {
  return regions.find((r) => r.slug === slug)
}

export function getRegionById(id: string): Region | undefined {
  return regions.find((r) => r.id === id)
}

