import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { template: '%s | TEAM Admin', default: 'Admin | TEAM Consulting' },
  robots: { index: false, follow: false },
}

/**
 * Admin layout - intentionally does NOT include the site Header/Footer.
 * Auth is enforced at the middleware layer (middleware.ts).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

