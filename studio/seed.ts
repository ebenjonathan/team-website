import { createClient } from '@sanity/client'
import { faqItems } from '../lib/data/faqs'
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
} from '../lib/data/masterBrief'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function seed() {
  await client.createOrReplace({ _id: 'global-settings', _type: 'globalSettings', ...companyProfile })

  for (const [index, item] of serviceAreas.entries()) {
    await client.createOrReplace({ _id: `service-${item.slug}`, _type: 'serviceOffering', order: index + 1, ...item })
  }

  for (const [index, item] of businessUnits.entries()) {
    await client.createOrReplace({ _id: `business-unit-${item.slug}`, _type: 'businessUnit', order: index + 1, ...item })
  }

  for (const [index, item] of teamMembers.entries()) {
    await client.createOrReplace({ _id: `team-${item.id}`, _type: 'teamMember', order: index + 1, ...item })
  }

  for (const [index, item] of partners.entries()) {
    await client.createOrReplace({ _id: `partner-${item.id}`, _type: 'partner', order: index + 1, ...item })
  }

  for (const [index, item] of clients.entries()) {
    await client.createOrReplace({ _id: `client-${item.id}`, _type: 'client', order: index + 1, ...item })
  }

  for (const item of caseStudies) {
    await client.createOrReplace({ _id: `case-${item.id}`, _type: 'caseStudy', publishedAt: new Date().toISOString(), ...item })
  }

  for (const item of events) {
    await client.createOrReplace({ _id: `event-${item.id}`, _type: 'event', ...item })
  }

  for (const [index, item] of faqItems.entries()) {
    await client.createOrReplace({ _id: `faq-${item.id}`, _type: 'faq', order: index + 1, ...item })
  }

  for (const item of downloads) {
    await client.createOrReplace({ _id: `download-${item.id}`, _type: 'downloadResource', ...item })
  }

  await client.createOrReplace({
    _id: 'contact-zw',
    _type: 'countryContact',
    country: 'Zimbabwe',
    email: contacts.zimbabweEmail,
    phone: contacts.phone,
    address: contacts.headquarters,
    order: 1,
  })

  for (const item of ideasAtWorkArticles) {
    await client.createOrReplace({
      _id: `blog-${item.id}`,
      _type: 'blogPost',
      title: item.title,
      slug: { _type: 'slug', current: item.slug },
      excerpt: item.excerpt,
      tags: item.tags,
      href: item.downloadUrl,
      publishedAt: new Date().toISOString(),
    })
  }

  console.log('Sanity seed complete')
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
