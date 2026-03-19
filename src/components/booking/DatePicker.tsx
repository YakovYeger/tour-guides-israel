import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  selectedDate: Date | null
  onSelect: (date: Date) => void
  availableDates?: string[]
  minDate?: Date
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function getMonthDates(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const dates: Date[] = []
  
  // Add days from previous month to fill the first week
  for (let i = 0; i < firstDay.getDay(); i++) {
    const date = new Date(year, month, -i)
    dates.unshift(date)
  }
  
  // Add all days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    dates.push(new Date(year, month, i))
  }
  
  // Add days from next month to fill the last week
  const remaining = 42 - dates.length // 6 rows × 7 days
  for (let i = 1; i <= remaining; i++) {
    dates.push(new Date(year, month + 1, i))
  }
  
  return dates
}

export function DatePicker({ selectedDate, onSelect, availableDates = [], minDate }: DatePickerProps) {
  const [viewDate, setViewDate] = useState(selectedDate || new Date())
  
  const currentMonth = viewDate.getMonth()
  const currentYear = viewDate.getFullYear()
  const dates = getMonthDates(currentYear, currentMonth)
  
  const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1))
  const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1))
  
  const isDisabled = (date: Date) => {
    const today = minDate || new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return true
    if (availableDates.length > 0) {
      const dateStr = date.toISOString().split('T')[0]
      return !availableDates.includes(dateStr)
    }
    return false
  }
  
  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }
  
  const isToday = (date: Date) => date.toDateString() === new Date().toDateString()
  const isCurrentMonth = (date: Date) => date.getMonth() === currentMonth

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-semibold text-gray-900">{MONTHS[currentMonth]} {currentYear}</h3>
        <button onClick={nextMonth} className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => {
          const disabled = isDisabled(date)
          const selected = isSelected(date)
          const today = isToday(date)
          const currentMo = isCurrentMonth(date)

          return (
            <button
              key={index}
              onClick={() => !disabled && onSelect(date)}
              disabled={disabled}
              className={cn(
                'relative h-10 rounded-lg text-sm font-medium transition-all flex items-center justify-center',
                !currentMo && 'text-gray-300',
                currentMo && !disabled && !selected && 'text-gray-900 hover:bg-gray-100',
                currentMo && disabled && 'text-gray-300 cursor-not-allowed',
                selected && 'bg-primary text-white hover:bg-primary-dark',
                today && !selected && 'ring-2 ring-primary ring-inset'
              )}
            >
              {date.getDate()}
              {availableDates.length > 0 && !disabled && currentMo && !selected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
              )}
            </button>
          )
        })}
      </div>

      {availableDates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />Available</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-300" />Unavailable</div>
        </div>
      )}
    </div>
  )
}

