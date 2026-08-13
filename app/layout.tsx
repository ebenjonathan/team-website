import type { Metadata } from 'next'
import { Montserrat, Roboto, Open_Sans } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '../styles/globals.css'
import { SITE_URL as siteUrl } from '@/lib/seo/site'

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
    template: '%s | TEAM Consulting',
    default: 'TEAM Consulting | Advisory for growth, governance and performance',
  },
  description:
    'TEAM Consulting is a boutique advisory practice helping organisations strengthen governance, performance, and people-centred execution.',
  keywords: [
    'business consulting',
    'governance',
    'strategy',
    'performance',
    'international advisory',
    'Zimbabwe',
  ],
  authors: [{ name: 'TEAM Consulting' }],
  creator: 'TEAM Consulting',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    locale: 'en_ZW',
    siteName: 'TEAM Consulting',
    title: 'TEAM Consulting | Advisory for growth, governance and performance',
    description:
      'Boutique advisory practice serving clients across international markets with practical, people-centred support.',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'TEAM Consulting' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TEAM Consulting',
    description: 'Advisory for growth, governance and performance',
    images: ['/images/og-image.png'],
  },
  robots: { index: true, follow: true },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TEAM Consulting',
  alternateName: 'TEAM Consulting',
  url: siteUrl,
  logo: `${siteUrl}/images/TEAM-logo.png`,
  foundingDate: '2004',
  description:
    'TEAM Consulting is a boutique advisory practice supporting organisations across international markets with practical, people-centred expertise.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Harare',
    addressCountry: 'ZW',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+263-77-220-2290',
    contactType: 'customer service',
    email: 'info@team.co.zw',
  },
  sameAs: [
    'https://zw.linkedin.com/company/teamadvisory',
    'https://www.facebook.com/TEAMConsult/',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${roboto.variable} ${openSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

