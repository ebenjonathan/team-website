import { z } from 'zod'

const shortList = z.array(z.string().trim().min(1).max(160)).max(25)

export const associateSchema = z.object({
  name: z.string().trim().min(2, 'Enter a name.').max(120),
  role: z.string().trim().min(2, 'Enter a role or title.').max(160),
  bio: z.string().trim().max(3000).default(''),
  photo: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === '' || v.startsWith('/uploads/') || v.startsWith('/images/') || v.startsWith('https://cdn.sanity.io/'), 'Upload the photo here.')
    .optional()
    .transform((v) => v || undefined),
  photoAssetId: z.string().trim().max(200).optional().transform((v) => v || undefined),
  focusAreas: shortList.default([]),
  sectors: shortList.default([]),
  qualifications: shortList.default([]),
  yearsConsulting: z.number().int().min(0).max(70).optional().nullable().transform((v) => v ?? undefined),
  overallExperience: z.number().int().min(0).max(70).optional().nullable().transform((v) => v ?? undefined),
  linkedin: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === '' || /^https:\/\/([a-z]{2,3}\.)?(www\.)?linkedin\.com\//i.test(v), 'Use a full LinkedIn address starting with https://')
    .optional()
    .transform((v) => v || undefined),
  published: z.boolean().default(false),
  order: z.number().int().min(0).max(9999).default(100),
})
