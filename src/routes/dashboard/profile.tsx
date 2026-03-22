import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, Loader2, Upload, X, Check } from 'lucide-react'

export const Route = createFileRoute('/dashboard/profile')({
  component: DashboardProfile,
})

const LANGUAGES = ['English', 'Hebrew', 'Spanish', 'French', 'German', 'Italian', 'Russian', 'Chinese', 'Japanese', 'Arabic', 'Portuguese']
const SPECIALTIES = ['Historical', 'Religious', 'Food & Wine', 'Adventure', 'Family-Friendly', 'Photography', 'Nature', 'Architecture', 'Night Tours', 'Accessible']
const REGIONS = ['Jerusalem', 'Tel Aviv', 'Galilee', 'Dead Sea', 'Negev', 'Haifa', 'Golan Heights', 'Eilat', 'West Bank', 'Nazareth']

function DashboardProfile() {
  const { guide, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const [form, setForm] = useState({
    full_name: '',
    business_name: '',
    bio: '',
    phone: '',
    years_experience: 0,
    licensed_guide_number: '',
    unique_approach: '',
    why_tour_guide: '',
    website: '',
    video_url: '',
    languages: [] as string[],
    specialties: [] as string[],
    regions_covered: [] as string[],
    pricing: { hourly: 0, halfDay: 0, fullDay: 0 },
  })

  // Load guide data into form
  useEffect(() => {
    if (guide) {
      setForm({
        full_name: guide.full_name || '',
        business_name: guide.business_name || '',
        bio: guide.bio || '',
        phone: guide.phone || '',
        years_experience: guide.years_experience || 0,
        licensed_guide_number: guide.licensed_guide_number || '',
        unique_approach: guide.unique_approach || '',
        why_tour_guide: guide.why_tour_guide || '',
        website: guide.website || '',
        video_url: guide.video_url || '',
        languages: guide.languages || [],
        specialties: guide.specialties || [],
        regions_covered: guide.regions_covered || [],
        pricing: (guide.pricing as any) || { hourly: 0, halfDay: 0, fullDay: 0 },
      })
    }
  }, [guide])

  const toggleArrayItem = (field: 'languages' | 'specialties' | 'regions_covered', item: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }))
  }

  const handleSave = async () => {
    if (!supabase || !guide?.id) return

    setSaveStatus('saving')
    setIsLoading(true)

    const { error } = await supabase
      .from('guides')
      .update({
        full_name: form.full_name,
        business_name: form.business_name,
        bio: form.bio,
        phone: form.phone,
        years_experience: form.years_experience,
        licensed_guide_number: form.licensed_guide_number,
        unique_approach: form.unique_approach,
        why_tour_guide: form.why_tour_guide,
        website: form.website,
        video_url: form.video_url,
        languages: form.languages,
        specialties: form.specialties,
        regions_covered: form.regions_covered,
        pricing: form.pricing,
        updated_at: new Date().toISOString(),
      })
      .eq('id', guide.id)

    setIsLoading(false)

    if (error) {
      console.error('Error saving profile:', error)
      setSaveStatus('error')
    } else {
      setSaveStatus('saved')
    }

    setTimeout(() => setSaveStatus('idle'), 3000)
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-sm sm:text-base text-gray-500">Update your guide profile information</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="self-start sm:self-auto">
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> :
           saveStatus === 'saved' ? <Check className="h-4 w-4 mr-2" /> :
           <Save className="h-4 w-4 mr-2" />}
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save'}
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Full Name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
            <Input label="Business Name (optional)" value={form.business_name} onChange={e => setForm({...form, business_name: e.target.value})} placeholder="Your tour company name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea rows={4} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className={inputClass} placeholder="Tell travelers about yourself..." />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+972 50 123 4567" />
            <Input label="Email" value={user?.email || ''} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Professional Info */}
      <Card>
        <CardHeader><CardTitle>Professional Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Years of Experience" type="number" value={form.years_experience} onChange={e => setForm({...form, years_experience: +e.target.value})} />
            <Input label="License Number" value={form.licensed_guide_number} onChange={e => setForm({...form, licensed_guide_number: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Unique Approach</label>
            <textarea rows={3} value={form.unique_approach} onChange={e => setForm({...form, unique_approach: e.target.value})} className={inputClass} placeholder="What makes your tours special?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Why I Became a Tour Guide</label>
            <textarea rows={3} value={form.why_tour_guide} onChange={e => setForm({...form, why_tour_guide: e.target.value})} className={inputClass} placeholder="Share your story..." />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader><CardTitle>Pricing (USD)</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Input label="Hourly Rate" type="number" value={form.pricing.hourly} onChange={e => setForm({...form, pricing: {...form.pricing, hourly: +e.target.value}})} />
            <Input label="Half Day Rate" type="number" value={form.pricing.halfDay} onChange={e => setForm({...form, pricing: {...form.pricing, halfDay: +e.target.value}})} />
            <Input label="Full Day Rate" type="number" value={form.pricing.fullDay} onChange={e => setForm({...form, pricing: {...form.pricing, fullDay: +e.target.value}})} />
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader><CardTitle>Languages</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => (
              <Badge key={lang} variant={form.languages.includes(lang) ? 'primary' : 'secondary'} className="cursor-pointer" onClick={() => toggleArrayItem('languages', lang)}>
                {lang} {form.languages.includes(lang) && <X className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card>
        <CardHeader><CardTitle>Specialties</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.map(spec => (
              <Badge key={spec} variant={form.specialties.includes(spec) ? 'primary' : 'secondary'} className="cursor-pointer" onClick={() => toggleArrayItem('specialties', spec)}>
                {spec} {form.specialties.includes(spec) && <X className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regions */}
      <Card>
        <CardHeader><CardTitle>Regions Covered</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(region => (
              <Badge key={region} variant={form.regions_covered.includes(region) ? 'primary' : 'secondary'} className="cursor-pointer" onClick={() => toggleArrayItem('regions_covered', region)}>
                {region} {form.regions_covered.includes(region) && <X className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader><CardTitle>Links</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Website" value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://your-website.com" />
            <Input label="Video URL" value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} placeholder="https://youtube.com/watch?v=..." />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

