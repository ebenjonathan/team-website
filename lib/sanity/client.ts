import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export const hasSanityConfig = Boolean(projectId) && Boolean(dataset)

export const sanityClient = hasSanityConfig
  ? createClient({
      projectId: projectId as string,
      dataset: dataset as string,
      apiVersion: '2024-01-01',
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null
