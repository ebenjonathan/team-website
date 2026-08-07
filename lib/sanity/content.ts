import type { BusinessUnit, CaseStudy, ClientLogo, Event, FAQ, Partner, Service, TeamMember } from '@/types'
import { faqItems as faqSeed } from '@/lib/data/faqs'
import {
  businessUnits,
  caseStudies,
  clients,
  companyProfile,
  contacts,
  downloads,
  events,
  ideasAtWorkArticles,
  partners,
  serviceAreas,
  teamMembers,
} from '@/lib/data'
import {
  BUSINESS_UNITS_QUERY,
  CASE_STUDIES_QUERY,
  CLIENTS_QUERY,
  CONTACTS_QUERY,
  DOWNLOAD_ASSETS_QUERY,
  EVENTS_QUERY,
  FAQ_QUERY,
  GLOBAL_SETTINGS_QUERY,
  PARTNERS_QUERY,
  SERVICES_QUERY,
  TEAM_QUERY,
} from './queries'
import { fetchWithFallback } from './fetchWithFallback'

export async function getServiceOfferings(): Promise<Service[]> {
  const data = await fetchWithFallback<any[]>(SERVICES_QUERY, serviceAreas)
  return data
    .filter((item) => item.slug !== 'technology-digital')
    .map((item) => ({
      id: item._id ?? item.id,
      slug: item.slug,
      title: item.slug === 'strategy-design' ? 'Strategy' : item.title,
      description: item.description,
      icon: item.icon ?? 'Briefcase',
      features: item.features ?? [],
      notableAssignments: item.notableAssignments ?? [],
      downloadableProfile: item.downloadableProfile,
      businessUnit: item.businessUnit,
      fullDescription: item.fullDescription,
      benefits: item.benefits,
      deliverables: item.deliverables,
      image: item.image,
    }))
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const items = await getServiceOfferings()
  return items.find((item) => item.slug === slug)
}

export async function getBusinessUnits(): Promise<BusinessUnit[]> {
  const data = await fetchWithFallback<any[]>(BUSINESS_UNITS_QUERY, businessUnits)
  return data.map((item) => ({
    id: item._id ?? item.id,
    slug: item.slug,
    name: item.name,
    tagline: item.tagline,
    description: item.description,
    services: item.services ?? [],
    head: item.head,
    image: item.image,
  }))
}

export async function getBusinessUnitBySlug(slug: string): Promise<BusinessUnit | undefined> {
  const items = await getBusinessUnits()
  return items.find((item) => item.slug === slug)
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const data = await fetchWithFallback<any[]>(CASE_STUDIES_QUERY, caseStudies)
  return data.map((item) => ({
    id: item._id ?? item.id,
    slug: item.slug,
    title: item.title,
    category: item.category,
    client: item.client,
    duration: item.duration,
    image: item.image,
    summary: item.summary,
    tags: item.tags ?? [],
    metrics: item.metrics ?? [],
    services: item.services ?? [],
    challenge: item.challenge,
    approach: item.approach,
    technologies: item.technologies,
  }))
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
  const items = await getCaseStudies()
  return items.find((item) => item.slug === slug)
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const data = await fetchWithFallback<any[]>(TEAM_QUERY, teamMembers)
  return data.map((item) => ({
    id: item._id ?? item.id,
    name: item.name,
    role: item.role,
    bio: item.bio,
    image: item.image,
    socialLinks: item.socialLinks ?? {},
    yearsConsulting: item.yearsConsulting,
    overallExperience: item.overallExperience,
    qualifications: item.qualifications,
  }))
}

export async function getPartners(): Promise<Partner[]> {
  const data = await fetchWithFallback<any[]>(PARTNERS_QUERY, partners)
  return data.map((item) => ({
    id: item._id ?? item.id,
    name: item.name,
    logo: item.logo,
    description: item.description,
    type: item.type,
    website: item.website,
  }))
}

export async function getClients(): Promise<ClientLogo[]> {
  const data = await fetchWithFallback<any[]>(CLIENTS_QUERY, clients)
  return data.map((item) => ({
    id: item._id ?? item.id,
    name: item.name,
    logo: item.logo,
    website: item.website,
  }))
}

export async function getEvents(): Promise<Event[]> {
  const data = await fetchWithFallback<any[]>(EVENTS_QUERY, events)
  return data.map((item) => ({
    id: item._id ?? item.id,
    slug: item.slug,
    title: item.title,
    date: item.date,
    time: item.time,
    location: item.location,
    description: item.description,
    category: item.category,
    isFeatured: item.isFeatured,
    image: item.image,
    fullDescription: item.fullDescription,
    agenda: item.agenda,
    speakers: item.speakers,
  }))
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  const items = await getEvents()
  return items.find((item) => item.slug === slug)
}

export async function getFaqItems(): Promise<FAQ[]> {
  const data = await fetchWithFallback<any[]>(FAQ_QUERY, faqSeed as FAQ[])
  return data.map((item) => ({
    id: item._id ?? item.id,
    question: item.question,
    answer: item.answer,
    category: item.category,
    keywords: item.keywords,
  }))
}

export async function getDownloadResources(): Promise<Array<{ id: string; label: string; href: string }>> {
  const data = await fetchWithFallback<any[]>(DOWNLOAD_ASSETS_QUERY, downloads)
  return data.map((item) => ({
    id: item._id ?? item.id,
    label: item.label,
    href: item.href,
  }))
}

export async function getGlobalSettings() {
  return fetchWithFallback<any>(GLOBAL_SETTINGS_QUERY, companyProfile)
}

export async function getCountryContacts() {
  return fetchWithFallback<any>(CONTACTS_QUERY, contacts)
}

export async function getBlogPosts() {
  return fetchWithFallback<any[]>(
    `*[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      tags,
      "downloadUrl": resource.asset->url
    }`,
    ideasAtWorkArticles,
  )
}
