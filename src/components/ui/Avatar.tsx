import { cn } from '@/utils/cn'

interface AvatarProps {
  src?: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
}

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const initials = alt
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn('rounded-full object-cover', sizeMap[size], className)}
      />
    )
  }

  return (
    <div
      aria-label={alt}
      className={cn(
        'rounded-full bg-teal-500/20 text-teal-400 font-semibold flex items-center justify-center',
        sizeMap[size],
        className,
      )}
    >
      {initials}
    </div>
  )
}
