import { cn } from '@/utils/cn'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
        {
          'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white': variant === 'primary',
          'bg-surface-overlay hover:bg-teal-500/10 text-teal-400 hover:text-teal-300':
            variant === 'secondary',
          'hover:bg-surface-overlay text-text-secondary hover:text-text-primary':
            variant === 'ghost',
        },
        {
          'text-xs px-3 py-1.5 rounded-lg': size === 'sm',
          'text-sm px-5 py-2.5 rounded-xl': size === 'md',
          'text-base px-6 py-3 rounded-xl': size === 'lg',
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
