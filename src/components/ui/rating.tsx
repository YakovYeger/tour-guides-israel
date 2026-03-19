import * as React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  showCount?: boolean
  count?: number
  readonly?: boolean
  onChange?: (value: number) => void
  className?: string
}

export function Rating({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  showCount = false,
  count = 0,
  readonly = true,
  onChange,
  className,
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)

  const sizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const displayValue = hoverValue !== null ? hoverValue : value

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= displayValue
          const isHalf = !isFilled && starValue - 0.5 <= displayValue

          return (
            <button
              key={index}
              type="button"
              disabled={readonly}
              onClick={() => onChange?.(starValue)}
              onMouseEnter={() => !readonly && setHoverValue(starValue)}
              onMouseLeave={() => !readonly && setHoverValue(null)}
              className={cn(
                'transition-colors',
                readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              )}
            >
              <Star
                className={cn(
                  sizes[size],
                  isFilled || isHalf
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-300'
                )}
              />
            </button>
          )
        })}
      </div>
      
      {showValue && (
        <span className={cn('font-semibold text-gray-900', textSizes[size])}>
          {value.toFixed(1)}
        </span>
      )}
      
      {showCount && count > 0 && (
        <span className={cn('text-gray-500', textSizes[size])}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}

// Simple star display for compact use
export function StarRating({ 
  rating, 
  size = 'sm' 
}: { 
  rating: number
  size?: 'sm' | 'md' | 'lg' 
}) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <div className="flex items-center gap-1">
      <Star className={cn(sizes[size], 'text-amber-400 fill-amber-400')} />
      <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
    </div>
  )
}

