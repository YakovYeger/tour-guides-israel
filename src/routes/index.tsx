import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { HowItWorks } from '@/components/home/HowItWorks'
import { GuideCTA } from '@/components/home/GuideCTA'

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => ({
    meta: [
      {
        title: 'Tour Guides Israel | Find Licensed Tour Guides in Israel',
      },
      {
        name: 'description',
        content: 'Connect with licensed professional tour guides in Israel. Discover history, culture, and hidden gems with expert local guides.',
      },
    ],
  }),
})

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <GuideCTA />
    </>
  )
}
