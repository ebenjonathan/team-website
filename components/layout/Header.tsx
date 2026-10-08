'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'
import { navCta } from './navData'
import { cn } from '@/lib/utils'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>

      {/* Utility bar */}
      <div className="bg-primary-deeper text-white/80 text-xs hidden md:block">
        <div className="container mx-auto flex items-center justify-end h-9">
          <div className="flex items-center gap-5">
            <a href="tel:+263772202290" className="hover:text-white">
              +263 77 220 2290
            </a>
            <a href="mailto:info@team.co.zw" className="hover:text-white">
              info@team.co.zw
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 bg-white transition-shadow duration-300 border-b border-gray-200',
          scrolled && 'shadow-[0_8px_24px_-16px_rgba(23,38,36,0.4)]'
        )}
      >
        <div className="container mx-auto h-[72px] flex items-stretch justify-between gap-6">
          <Link href="/" className="flex items-center flex-shrink-0" aria-label="TEAM Consulting home">
            <Image
              src="/images/TEAM-logo.png"
              alt="TEAM Consulting"
              width={365}
              height={406}
              className="h-14 w-auto"
              priority
            />
          </Link>

          <Navigation />

          <div className="flex items-center gap-3">
            <Link
              href={navCta.href}
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary-dark transition-colors"
            >
              {navCta.label}
            </Link>
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-primary-deeper" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
