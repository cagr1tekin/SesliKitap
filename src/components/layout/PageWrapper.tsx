import { cn } from '@/utils/cn'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl' | 'full'
}

export function PageWrapper({ children, className, maxWidth = '7xl' }: PageWrapperProps) {
  return (
    <main
      className={cn(
        'mx-auto px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8',
        {
          'max-w-sm': maxWidth === 'sm',
          'max-w-md': maxWidth === 'md',
          'max-w-lg': maxWidth === 'lg',
          'max-w-xl': maxWidth === 'xl',
          'max-w-7xl': maxWidth === '7xl',
          'w-full': maxWidth === 'full',
        },
        className,
      )}
    >
      {children}
    </main>
  )
}
