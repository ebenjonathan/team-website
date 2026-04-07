'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, ChevronDown } from 'lucide-react'
import { navItems } from './Navigation'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const [openSection, setOpenSection] = useState<string | null>(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-primary-deeper/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <span className="font-bold font-heading text-primary-deeper">Navigation</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-primary-deeper" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setOpenSection(openSection === item.href ? null : item.href)
                    }
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-colors',
                      pathname.startsWith(item.href)
                        ? 'text-primary bg-primary-light'
                        : 'text-primary-deeper hover:bg-gray-50'
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform',
                        openSection === item.href && 'rotate-180'
                      )}
                    />
                  </button>
                  {openSection === item.href && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={cn(
                            'block px-4 py-2.5 rounded-lg text-sm transition-colors',
                            pathname === child.href
                              ? 'text-primary bg-primary-light'
                              : 'text-body hover:text-primary hover:bg-primary-light'
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-sm font-semibold transition-colors',
                    pathname === item.href
                      ? 'text-primary bg-primary-light'
                      : 'text-primary-deeper hover:bg-gray-50'
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100 space-y-1 text-sm text-body">
          <p className="font-medium text-primary-deeper">Team Advisory</p>
          <p>info@team.co.zw</p>
          <p>+263 77 220 2290</p>
        </div>
      </div>
    </div>
  )
}
