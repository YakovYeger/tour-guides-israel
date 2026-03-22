import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, Loader2, Check, Calendar, Clock, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/availability')({
  component: AvailabilityPage,
})

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function AvailabilityPage() {
  const { guide } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  
  const [availability, setAvailability] = useState<Record<string, boolean>>({
    sunday: true, monday: true, tuesday: true, wednesday: true, thursday: true, friday: false, saturday: false,
  })
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [showPublic, setShowPublic] = useState(true)

  useEffect(() => {
    if (guide?.availability) {
      setAvailability(guide.availability as Record<string, boolean>)
    }
    if (guide?.show_public_availability !== undefined) {
      setShowPublic(guide.show_public_availability)
    }
  }, [guide])

  const toggleDay = (day: string) => {
    setAvailability(prev => ({ ...prev, [day]: !prev[day] }))
  }

  const handleSave = async () => {
    if (!supabase || !guide?.id) {
      console.error('Cannot save: no supabase client or guide id')
      return
    }
    setSaveStatus('saving')
    setIsLoading(true)

    console.log('Saving availability:', { availability, showPublic, guideId: guide.id })

    const { data, error } = await supabase
      .from('guides')
      .update({
        availability,
        show_public_availability: showPublic,
        updated_at: new Date().toISOString()
      })
      .eq('id', guide.id)
      .select()

    console.log('Save result:', { data, error })

    setIsLoading(false)
    if (error) {
      console.error('Save error:', error)
      setSaveStatus('error')
    } else {
      setSaveStatus('saved')
    }
    setTimeout(() => setSaveStatus('idle'), 3000)
  }

  // Generate calendar for current month
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDay + 1
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null
  })

  const isDateBlocked = (day: number) => {
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return blockedDates.includes(date)
  }

  const toggleBlockDate = (day: number) => {
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setBlockedDates(prev => prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date])
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          <p className="text-gray-500">Set your weekly schedule and block specific dates</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 
           saveStatus === 'saved' ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Weekly Schedule</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">Select the days you're generally available for tours</p>
          <div className="flex flex-wrap gap-3">
            {DAYS.map((day, i) => (
              <button key={day} onClick={() => toggleDay(day)}
                className={cn('w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all',
                  availability[day] ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-400 hover:border-gray-300')}>
                <span className="text-sm font-semibold">{DAY_LABELS[i]}</span>
                {availability[day] && <Check className="h-4 w-4 mt-1" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> {today.toLocaleString('default', { month: 'long', year: 'numeric' })}</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">Click on dates to block/unblock them</p>
          <div className="grid grid-cols-7 gap-2">
            {DAY_LABELS.map(d => <div key={d} className="text-center text-sm font-medium text-gray-500 py-2">{d}</div>)}
            {calendarDays.map((day, i) => (
              <div key={i} className={cn('aspect-square flex items-center justify-center rounded-lg text-sm transition-all cursor-pointer',
                day === null ? '' :
                isDateBlocked(day) ? 'bg-red-100 text-red-600 line-through' :
                day === today.getDate() ? 'bg-primary text-white font-bold' :
                'hover:bg-gray-100')}
                onClick={() => day && toggleBlockDate(day)}>
                {day}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-primary" /> Today</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-100" /> Blocked</div>
          </div>
        </CardContent>
      </Card>

      {/* Visibility */}
      <Card>
        <CardHeader><CardTitle>Public Visibility</CardTitle></CardHeader>
        <CardContent>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={showPublic} onChange={e => setShowPublic(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <div>
              <p className="font-medium text-gray-900">Show availability on my public profile</p>
              <p className="text-sm text-gray-500">Travelers can see which days you're available</p>
            </div>
          </label>
        </CardContent>
      </Card>
    </div>
  )
}

