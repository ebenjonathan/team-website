'use client'

import { usePathname } from 'next/navigation'

/** Hides the public site header and footer on admin screens. */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <>{children}</>
}
