import { cn } from '@/utils/cn'

interface ChipProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
}

export function Chip({ children, active = false, onClick, className }: ChipProps) {
  return (
    <span
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full transition-colors duration-150',
        active
          ? 'bg-teal-500 text-white'
          : 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </span>
  )
}
