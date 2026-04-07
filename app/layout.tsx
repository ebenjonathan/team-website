import type { Metadata } from 'next'
import { Montserrat, Roboto, Open_Sans } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '../styles/globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.teamadvisory.com'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-open-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Team Advisory',
    default: 'Team Advisory — Transforming Ideas Into Strategic Business Solutions',
  },
  description:
    'Team Advisory is a premier business consultancy and digital solutions firm. We partner with organisations to design, build, and scale digital experiences that drive measurable impact.',
  keywords: [
    'business consulting',
    'digital solutions',
    'strategy',
    'web development',
    'Africa',
    'Zimbabwe',
  ],
  authors: [{ name: 'Team Advisory' }],
  creator: 'Team Advisory',
  openGraph: {
    type: 'website',
    url: siteUrl,
    locale: 'en_ZW',
    siteName: 'Team Advisory',
    title: 'Team Advisory — Transforming Ideas Into Strategic Business Solutions',
    description:
      'Premier business consultancy and digital solutions firm serving clients across Africa and beyond.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@teamadvisory',
    title: 'Team Advisory',
    description: 'Transforming Ideas Into Strategic Business Solutions',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${roboto.variable} ${openSans.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
