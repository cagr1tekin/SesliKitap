import { Star } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils/cn'

interface StarRatingProps {
  value: number
  max?: number
  onChange?: (value: number) => void
  size?: number
  className?: string
}

export function StarRating({ value, max = 5, onChange, size = 16, className }: StarRatingProps) {
  const [hover, setHover] = useState(0)

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const filled = star <= (hover || value)
        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} yıldız`}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => onChange && setHover(star)}
            onMouseLeave={() => onChange && setHover(0)}
            className={cn('transition-colors', onChange ? 'cursor-pointer' : 'cursor-default')}
          >
            <Star
              size={size}
              strokeWidth={1.75}
              className={cn(filled ? 'text-yellow-400 fill-yellow-400' : 'text-text-tertiary')}
            />
          </button>
        )
      })}
    </div>
  )
}
