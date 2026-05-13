import { cn } from '@/utils/cn'

interface ProgressBarProps {
  value: number
  max?: number
  onClick?: (value: number) => void
  className?: string
  showThumb?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  onClick,
  className,
  showThumb = false,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = x / rect.width
    onClick(ratio * max)
  }

  return (
    <div
      className={cn(
        'relative h-1 bg-surface-overlay rounded-full overflow-hidden',
        onClick && 'cursor-pointer group',
        className,
      )}
      onClick={handleClick}
      role={onClick ? 'slider' : undefined}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="absolute inset-y-0 left-0 bg-teal-500 rounded-full transition-all duration-100"
        style={{ width: `${percent}%` }}
      />
      {showThumb && (
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${percent}%` }}
        />
      )}
    </div>
  )
}
