import Link from 'next/link'
import { cn } from '@/lib/utils'

/** Small section marker in the "— Label" style, sentence case. */
export function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={cn('text-sm font-semibold mb-5', light ? 'text-primary-muted' : 'text-primary')}>
      <span aria-hidden>— </span>
      {children}
    </p>
  )
}

/** Plain text link with a trailing arrow. */
export function ArrowLink({
  href,
  children,
  external,
  className,
  light,
}: {
  href: string
  children: React.ReactNode
  external?: boolean
  className?: string
  light?: boolean
}) {
  const cls = cn(
    'inline-flex items-baseline gap-1 font-semibold underline-offset-4 decoration-2 hover:underline',
    light ? 'text-white' : 'text-primary-deeper hover:text-primary',
    className
  )
  const body = (
    <>
      {children}
      <span aria-hidden className="text-primary">
        →
      </span>
    </>
  )
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {body}
    </Link>
  )
}

/** Primary filled button link. */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'light'
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 px-6 py-3.5 rounded-md font-semibold transition-colors',
        variant === 'primary'
          ? 'bg-primary text-white hover:bg-primary-dark'
          : 'bg-white text-primary-deeper hover:bg-primary-muted'
      )}
    >
      {children} <span aria-hidden>→</span>
    </Link>
  )
}

/** Label / value rows used for engagement specs. */
export function SpecList({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="grid sm:grid-cols-3 border-y border-gray-200 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 my-8">
      {rows.map((r) => (
        <div key={r.label} className="py-4 sm:px-5 first:sm:pl-0">
          <dt className="text-sm text-body/70">{r.label}</dt>
          <dd className="mt-1 font-semibold text-primary-deeper">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}
