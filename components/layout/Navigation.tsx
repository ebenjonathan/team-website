'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navGroups, type NavGroup, type NavLink } from './navData'

function MenuLink({ link, onNavigate }: { link: NavLink; onNavigate: () => void }) {
  const cls =
    'block py-1.5 text-[15px] text-primary-deeper hover:text-primary focus-visible:text-primary transition-colors'
  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onNavigate}>
      {link.label}
    </a>
  ) : (
    <Link href={link.href} className={cls} onClick={onNavigate}>
      {link.label}
    </Link>
  )
}

function isActive(group: NavGroup, pathname: string) {
  if (group.href === '/') return pathname === '/'
  return (
    pathname.startsWith(group.href) ||
    !!group.columns?.some((c) => c.links.some((l) => !l.external && pathname === l.href))
  )
}

export function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState<number | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => setOpen(null), [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  const show = (i: number) => {
    clearTimeout(closeTimer.current)
    setOpen(i)
  }
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 120)
  }
  const close = () => setOpen(null)
  const activeIndex = navGroups.findIndex((g) => isActive(g, pathname))

  return (
    <nav ref={navRef} className="hidden lg:flex items-center gap-1 h-full" aria-label="Main">
      {navGroups.map((group, i) => {
        const active = i === activeIndex
        const itemCls = cn(
          'flex items-center gap-1 px-3 h-full text-sm font-semibold transition-colors border-b-2',
          active || open === i
            ? 'text-primary border-primary'
            : 'text-primary-deeper border-transparent hover:text-primary'
        )

        if (!group.columns) {
          return (
            <Link key={group.label} href={group.href} className={itemCls}>
              {group.label}
            </Link>
          )
        }

        const wide = !!group.feature
        return (
          <div
            key={group.label}
            className={cn('h-full flex', !wide && 'relative')}
            onMouseEnter={() => show(i)}
            onMouseLeave={hide}
          >
            <button
              type="button"
              className={itemCls}
              aria-expanded={open === i}
              aria-controls={`mega-${i}`}
              onClick={() => (open === i ? close() : show(i))}
            >
              {group.label}
              <ChevronDown
                className={cn('w-3.5 h-3.5 transition-transform', open === i && 'rotate-180')}
                aria-hidden
              />
            </button>

            {open === i && (
              <div
                id={`mega-${i}`}
                className={cn(
                  'absolute top-full z-50 bg-white border-t border-gray-200 shadow-[0_24px_48px_-24px_rgba(23,38,36,0.35)]',
                  wide ? 'left-0 right-0' : 'left-0 min-w-[260px]'
                )}
              >
                <div className={cn(wide ? 'container mx-auto py-10' : 'px-6 py-6')}>
                  <div className={cn(wide && 'grid grid-cols-12 gap-10')}>
                    <div
                      className={cn(
                        wide ? 'col-span-8 grid grid-cols-3 gap-8' : 'space-y-6'
                      )}
                    >
                      {group.columns.map((col) => (
                        <div key={col.heading}>
                          <p className="text-sm font-semibold text-body/70 mb-3">{col.heading}</p>
                          <ul>
                            {col.links.map((link) => (
                              <li key={link.href + link.label}>
                                <MenuLink link={link} onNavigate={close} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {group.feature && (
                      <div className="col-span-4 border-l border-gray-200 pl-10">
                        <p className="text-sm font-semibold text-body/70 mb-3">
                          {group.feature.heading}
                        </p>
                        <p className="text-[15px] text-body leading-relaxed mb-4">
                          {group.feature.body}
                        </p>
                        <Link
                          href={group.feature.link.href}
                          onClick={close}
                          className="font-semibold text-primary hover:text-primary-dark"
                        >
                          {group.feature.link.label} →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {group.footnote && (
                  <div className="bg-primary-light border-t border-gray-200">
                    <div className="container mx-auto py-4 text-sm text-primary-deeper">
                      <strong>{group.footnote.lead}</strong>{' '}
                      <Link
                        href={group.footnote.link.href}
                        onClick={close}
                        className="text-primary font-semibold hover:text-primary-dark"
                      >
                        {group.footnote.link.label} →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
