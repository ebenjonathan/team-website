'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Phone, Menu, Facebook, Linkedin, MapPin } from 'lucide-react'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'
import { cn } from '@/lib/utils'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Topbar */}
      <div className="bg-primary-deeper text-white text-xs py-2 hidden md:block">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href="mailto:info@team.co.zw"
              className="flex items-center gap-1.5 hover:text-primary-muted transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> info@team.co.zw
            </a>
            <a
              href="tel:+263772202290"
              className="flex items-center gap-1.5 hover:text-primary-muted transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> +263 77 220 2290
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/TEAMConsult/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="TEAM Consulting on Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://zw.linkedin.com/company/teamadvisory"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="TEAM Consulting on LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://share.google/xTt7ttQ2LtjxGdMqB"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Find TEAM Consulting on Google"
            >
              <MapPin className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          'sticky top-0 z-40 bg-white transition-all duration-300',
          scrolled ? 'shadow-md' : 'border-b border-gray-100'
        )}
      >
        <div className="container mx-auto h-16 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
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
              href="/contact-us"
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Get in Touch
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-primary-deeper" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}

