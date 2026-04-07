import type { MetadataRoute } from 'next'
import { businessUnits, caseStudies, events, services } from '@/lib/data'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.teamadvisory.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/who-we-are',
    '/service-offerings',
    '/ideas-at-work',
    '/upcoming-events',
    '/why-team',
    '/why-team/our-team',
    '/why-team/our-partners',
    '/why-team/our-clients',
    '/why-team/our-success-stories',
    '/contact-us',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }))

  const serviceRoutes = services.map((service) => ({
    url: `${siteUrl}/service-offerings/${service.slug}`,
    lastModified: new Date(),
  }))

  const caseStudyRoutes = caseStudies.map((study) => ({
    url: `${siteUrl}/ideas-at-work/${study.slug}`,
    lastModified: new Date(),
  }))

  const eventRoutes = events.map((event) => ({
    url: `${siteUrl}/upcoming-events/${event.slug}`,
    lastModified: new Date(),
  }))

  const businessUnitRoutes = businessUnits.map((unit) => ({
    url: `${siteUrl}/business-units/${unit.slug}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...serviceRoutes, ...caseStudyRoutes, ...eventRoutes, ...businessUnitRoutes]
}