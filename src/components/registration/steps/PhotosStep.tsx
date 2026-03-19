import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Upload, Image, Video, Globe } from 'lucide-react'
import type { StepProps } from '../types'

export function PhotosStep({ data, updateData, onNext, onBack }: StepProps) {
  const { t } = useTranslation(['guides', 'common'])

  // For now, we'll use URL inputs. In production, this would be file uploads to Supabase Storage
  const isValid = data.photoUrl.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-desert-ink mb-2">Photos & Media</h2>
        <p className="text-desert-ink-soft">Add photos and media to make your profile stand out</p>
      </div>

      {/* Profile Photo */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-desert-ink flex items-center gap-2">
          <Image className="h-4 w-4" />
          Profile Photo URL *
        </label>
        <Input
          type="url"
          value={data.photoUrl}
          onChange={(e) => updateData({ photoUrl: e.target.value })}
          placeholder="https://example.com/your-photo.jpg"
          required
        />
        <p className="text-xs text-desert-ink-soft">Use a professional headshot. Square format works best.</p>
      </div>

      {/* Preview */}
      {data.photoUrl && (
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-2xl overflow-hidden bg-earth-100 border-2 border-line">
            <img
              src={data.photoUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = ''
                ;(e.target as HTMLImageElement).alt = 'Invalid image'
              }}
            />
          </div>
        </div>
      )}

      {/* Additional Photos */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-desert-ink flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Additional Photo URLs (optional)
        </label>
        <textarea
          value={data.additionalPhotos.join('\n')}
          onChange={(e) => updateData({ additionalPhotos: e.target.value.split('\n').filter(url => url.trim()) })}
          placeholder="https://example.com/tour-photo-1.jpg&#10;https://example.com/tour-photo-2.jpg&#10;https://example.com/tour-photo-3.jpg"
          rows={4}
          className="flex w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-desert-ink-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/50 focus-visible:border-sunset transition-colors"
        />
        <p className="text-xs text-desert-ink-soft">Add one URL per line. Show off your tours, locations, and happy clients!</p>
      </div>

      {/* Video URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-desert-ink flex items-center gap-2">
          <Video className="h-4 w-4" />
          Introduction Video URL (optional)
        </label>
        <Input
          type="url"
          value={data.videoUrl}
          onChange={(e) => updateData({ videoUrl: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
        />
        <p className="text-xs text-desert-ink-soft">YouTube or Vimeo links work best</p>
      </div>

      {/* Website */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-desert-ink flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Website (optional)
        </label>
        <Input
          type="url"
          value={data.website}
          onChange={(e) => updateData({ website: e.target.value })}
          placeholder="https://your-website.com"
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="lg" disabled={!isValid}>
          Continue
        </Button>
      </div>
    </form>
  )
}

