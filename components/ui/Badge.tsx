import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'light'
  className?: string
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  const variants = {
    primary: 'bg-primary text-white',
    outline: 'border border-primary text-primary',
    light: 'bg-primary-muted text-primary',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
