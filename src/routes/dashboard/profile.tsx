import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Save, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/dashboard/profile')({
  component: DashboardProfile,
})

function DashboardProfile() {
  const { t } = useTranslation(['guides', 'common'])
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // TODO: Save to Supabase
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-desert-ink">Edit Profile</h1>
          <p className="text-desert-ink-soft">Update your guide profile information</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-desert-ink">Full Name</label>
              <Input defaultValue={user?.user_metadata?.full_name || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-desert-ink">Business Name (optional)</label>
              <Input placeholder="Your tour company name" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-desert-ink">Bio</label>
            <textarea
              rows={4}
              placeholder="Tell travelers about yourself..."
              className="flex w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-desert-ink-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/50 focus-visible:border-sunset transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-desert-ink">Email</label>
              <Input type="email" defaultValue={user?.email || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-desert-ink">Phone</label>
              <Input type="tel" placeholder="+972 50 123 4567" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-desert-ink">Years of Experience</label>
              <Input type="number" min="0" max="50" defaultValue="5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-desert-ink">License Number</label>
              <Input placeholder="Tour guide license number" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-desert-ink">Your Unique Approach</label>
            <textarea
              rows={3}
              placeholder="What makes your tours special?"
              className="flex w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-desert-ink-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/50 focus-visible:border-sunset transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-desert-ink">Why I Became a Tour Guide</label>
            <textarea
              rows={3}
              placeholder="Share your story..."
              className="flex w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-desert-ink-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/50 focus-visible:border-sunset transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact & Links */}
      <Card>
        <CardHeader>
          <CardTitle>Contact & Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-desert-ink">Website</label>
              <Input type="url" placeholder="https://your-website.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-desert-ink">Introduction Video URL</label>
              <Input type="url" placeholder="https://youtube.com/watch?v=..." />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

