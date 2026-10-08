'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, ChevronDown } from 'lucide-react'
import { navGroups, navCta } from './navData'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [openSection, setOpenSection] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 bg-primary-deeper/60" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[22rem] max-w-full bg-white overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-gray-200">
          <span className="font-semibold text-primary-deeper">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-primary-deeper" />
          </button>
        </div>

        <nav className="flex-1 px-6 py-2" aria-label="Mobile">
          {navGroups.map((group) =>
            group.columns ? (
              <div key={group.label} className="border-b border-gray-200">
                <button
                  onClick={() => setOpenSection(openSection === group.label ? null : group.label)}
                  aria-expanded={openSection === group.label}
                  className="w-full flex items-center justify-between py-4 text-base font-semibold text-primary-deeper"
                >
                  {group.label}
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform',
                      openSection === group.label && 'rotate-180'
                    )}
                  />
                </button>
                {openSection === group.label && (
                  <div className="pb-4 space-y-4">
                    {group.columns.map((col) => (
                      <div key={col.heading}>
                        <p className="text-sm text-body/70 mb-1">{col.heading}</p>
                        {col.links.map((link) =>
                          link.external ? (
                            <a
                              key={link.label}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block py-1.5 text-primary-deeper"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link
                              key={link.label}
                              href={link.href}
                              onClick={onClose}
                              className="block py-1.5 text-primary-deeper"
                            >
                              {link.label}
                            </Link>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={group.label}
                href={group.href}
                onClick={onClose}
                className="block py-4 text-base font-semibold text-primary-deeper border-b border-gray-200"
              >
                {group.label}
              </Link>
            )
          )}
        </nav>

        <div className="p-6 space-y-4">
          <Link
            href={navCta.href}
            onClick={onClose}
            className="block text-center px-5 py-3 bg-primary text-white font-semibold rounded-md"
          >
            {navCta.label}
          </Link>
          <div className="text-sm text-body space-y-1">
            <p>+263 77 220 2290</p>
            <p>info@team.co.zw</p>
          </div>
        </div>
      </div>
    </div>
  )
}
