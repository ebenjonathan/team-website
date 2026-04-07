'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Who We Are', href: '/who-we-are' },
  { label: 'Service Offerings', href: '/service-offerings' },
  { label: 'Our Markets & Clients', href: '/our-markets-clients' },
  { label: 'Ideas at Work', href: '/ideas-at-work' },
  { label: 'Upcoming Events', href: '/upcoming-events' },
  { label: 'FAQ', href: '/faq' },
  {
    label: 'Why Team?',
    href: '/why-team',
    children: [
      { label: 'Our Team', href: '/why-team/our-team' },
      { label: 'Our Partners', href: '/why-team/our-partners' },
      { label: 'Our Clients', href: '/why-team/our-clients' },
      { label: 'Our Success Stories', href: '/why-team/our-success-stories' },
    ],
  },
  { label: 'Free Diagnostic', href: '/free-diagnostic' },
  { label: 'Contact Us', href: '/contact-us' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {navItems.map((item) => (
        <div key={item.href} className="relative group">
          {item.children ? (
            <>
              <button
                className={cn(
                  'flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors font-nav',
                  pathname.startsWith(item.href)
                    ? 'text-primary'
                    : 'text-primary-deeper hover:text-primary'
                )}
              >
                {item.label}
                <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'block px-5 py-2.5 text-sm font-medium transition-colors',
                        pathname === child.href
                          ? 'text-primary bg-primary-light'
                          : 'text-body hover:text-primary hover:bg-primary-light'
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Link
              href={item.href}
              className={cn(
                'px-3 py-2 text-sm font-semibold rounded-md transition-colors font-nav',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-primary-deeper hover:text-primary'
              )}
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
