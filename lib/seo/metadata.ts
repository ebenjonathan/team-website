import type { Metadata } from 'next'
import { SITE_URL as BASE_URL } from './site'

export function buildMetadata(override: Partial<Metadata>): Metadata {
  return {
    ...override,
    openGraph: {
      type: 'website',
      siteName: 'TEAM Consulting',
      url: BASE_URL,
      images: [{ url: `${BASE_URL}/images/og-image.png`, width: 1200, height: 630 }],
      ...(override.openGraph ?? {}),
    },
    twitter: {
      card: 'summary_large_image',
      ...(override.twitter ?? {}),
    },
  }
}

