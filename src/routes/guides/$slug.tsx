import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useGuide } from '@/hooks/use-guides'
import { GuideProfileHeader } from '@/components/guides/GuideProfileHeader'
import { GuideProfileTabs } from '@/components/guides/GuideProfileTabs'
import { GuideContactSidebar } from '@/components/guides/GuideContactSidebar'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/guides/$slug')({
  component: GuideProfilePage,
  head: ({ params }) => ({
    meta: [
      { title: `Tour Guide Profile | Tour Guides Israel` },
    ],
  }),
})

function GuideProfilePage() {
  const { slug } = Route.useParams()
  const { t } = useTranslation(['guides', 'common'])
  const { data: guide, isLoading, error } = useGuide(slug)

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sunset" />
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-desert-ink mb-2">Guide Not Found</h1>
        <p className="text-desert-ink-soft">The guide you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-12">
      <div className="page-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <GuideProfileHeader guide={guide} />
            <GuideProfileTabs guide={guide} />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <GuideContactSidebar guide={guide} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

