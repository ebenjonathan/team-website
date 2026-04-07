import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  centered?: boolean
  light?: boolean
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  centered,
  light = false,
  className,
}: SectionHeaderProps) {
  const resolvedAlign = centered ? 'center' : align

  return (
    <div
      className={cn(
        'mb-12',
        resolvedAlign === 'center' && 'text-center',
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'text-sm font-semibold uppercase tracking-widest',
            light ? 'text-primary-muted' : 'text-primary'
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'mt-2 text-3xl md:text-4xl font-bold font-heading',
          light ? 'text-white' : 'text-primary-deeper'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 text-lg max-w-2xl leading-relaxed',
            resolvedAlign === 'center' && 'mx-auto',
            light ? 'text-white/70' : 'text-body'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
