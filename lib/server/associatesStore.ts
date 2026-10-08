import { mkdir, readFile, writeFile, rename } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { createClient, type SanityClient } from '@sanity/client'
import { associateSeed, type Associate } from '@/lib/data/associates'

/*
 * Where associate consultants are stored.
 *
 *  - Sanity (recommended for the live site): set NEXT_PUBLIC_SANITY_PROJECT_ID,
 *    NEXT_PUBLIC_SANITY_DATASET and SANITY_API_TOKEN (a token with Editor rights).
 *    Works on any host, including Vercel.
 *  - Local file (default): data/associates.json and data/uploads/. Works on your
 *    own server and while developing. On hosts with a read-only file system
 *    (such as Vercel) changes cannot be saved, and the admin screen says so.
 */

export type StorageMode = 'sanity' | 'file'

export interface StorageStatus {
  mode: StorageMode
  persistent: boolean
  message: string
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

let writeClient: SanityClient | null = null
function sanity(): SanityClient | null {
  if (!projectId || !dataset || !token) return null
  writeClient ??= createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })
  return writeClient
}

export function storageStatus(): StorageStatus {
  if (sanity()) {
    return { mode: 'sanity', persistent: true, message: 'Saved to Sanity. Changes appear on the website within a minute.' }
  }
  if (process.env.VERCEL) {
    return {
      mode: 'file',
      persistent: false,
      message:
        'This host cannot save files, so changes made here will be lost. Connect Sanity (see the setup notes) to save associates permanently.',
    }
  }
  return { mode: 'file', persistent: true, message: 'Saved to this server (data/associates.json).' }
}

// ─── File storage ───────────────────────────────────────────────────────────
const dataDir = path.join(process.cwd(), 'data')
const file = path.join(dataDir, 'associates.json')
export const uploadsDir = path.join(dataDir, 'uploads')

async function readFileStore(): Promise<Associate[]> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as Associate[]
  } catch {
    return associateSeed
  }
}

async function writeFileStore(items: Associate[]) {
  await mkdir(dataDir, { recursive: true })
  const tmp = `${file}.${process.pid}.tmp`
  await writeFile(tmp, JSON.stringify(items, null, 2), 'utf8')
  await rename(tmp, file) // atomic replace so a crash never leaves half a file
}

// ─── Sanity storage ─────────────────────────────────────────────────────────
const SANITY_FIELDS = `
  "id": _id, name, role, bio, focusAreas, sectors, qualifications,
  yearsConsulting, overallExperience, "linkedin": socialLinks.linkedin,
  "published": coalesce(published, false), "order": coalesce(order, 100),
  "photo": photo.asset->url, "photoAssetId": photo.asset._ref, "updatedAt": _updatedAt
`

function toSanityDoc(a: Omit<Associate, 'id' | 'updatedAt'>) {
  return {
    _type: 'teamMember',
    memberType: 'associate',
    name: a.name,
    role: a.role,
    bio: a.bio,
    focusAreas: a.focusAreas,
    sectors: a.sectors,
    qualifications: a.qualifications,
    yearsConsulting: a.yearsConsulting ?? null,
    overallExperience: a.overallExperience ?? null,
    socialLinks: { linkedin: a.linkedin || undefined },
    published: a.published,
    order: a.order,
    photo: a.photoAssetId ? { _type: 'image', asset: { _type: 'reference', _ref: a.photoAssetId } } : undefined,
  }
}

function normalise(list: Partial<Associate>[]): Associate[] {
  return list
    .map((a) => ({
      focusAreas: [],
      sectors: [],
      qualifications: [],
      bio: '',
      published: false,
      order: 100,
      updatedAt: new Date(0).toISOString(),
      ...a,
    }) as Associate)
    .sort((x, y) => x.order - y.order || x.name.localeCompare(y.name))
}

// ─── Public API ─────────────────────────────────────────────────────────────
export async function listAssociates(): Promise<Associate[]> {
  const client = sanity()
  if (client) {
    const rows = await client.fetch<Partial<Associate>[]>(
      `*[_type == "teamMember" && memberType == "associate"]{${SANITY_FIELDS}}`,
    )
    return normalise(rows)
  }
  return normalise(await readFileStore())
}

export async function listPublishedAssociates(): Promise<Associate[]> {
  // Public pages read without a token when only the project id is configured.
  if (!sanity() && projectId && dataset) {
    try {
      const reader = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false })
      const rows = await reader.fetch<Partial<Associate>[]>(
        `*[_type == "teamMember" && memberType == "associate" && published == true]{${SANITY_FIELDS}}`,
      )
      if (rows.length) return normalise(rows)
    } catch {
      /* fall through to the local file */
    }
  }
  try {
    return (await listAssociates()).filter((a) => a.published)
  } catch {
    return []
  }
}

export type AssociateInput = Omit<Associate, 'id' | 'updatedAt'>

export async function createAssociate(input: AssociateInput): Promise<Associate> {
  const client = sanity()
  if (client) {
    const doc = await client.create(toSanityDoc(input))
    return { ...input, id: doc._id, updatedAt: doc._updatedAt }
  }
  const items = await readFileStore()
  const base = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'associate'
  const id = items.some((a) => a.id === base) ? `${base}-${randomUUID().slice(0, 6)}` : base
  const created: Associate = { ...input, id, updatedAt: new Date().toISOString() }
  await writeFileStore([...items, created])
  return created
}

export async function updateAssociate(id: string, input: AssociateInput): Promise<Associate | null> {
  const client = sanity()
  if (client) {
    const existing = await client.getDocument(id)
    if (!existing || existing.memberType !== 'associate') return null
    const doc = toSanityDoc(input)
    const patch = client.patch(id).set(doc)
    if (!input.photoAssetId) patch.unset(['photo'])
    const saved = await patch.commit()
    return { ...input, id, updatedAt: saved._updatedAt }
  }
  const items = await readFileStore()
  const i = items.findIndex((a) => a.id === id)
  if (i < 0) return null
  items[i] = { ...input, id, updatedAt: new Date().toISOString() }
  await writeFileStore(items)
  return items[i]
}

export async function deleteAssociate(id: string): Promise<boolean> {
  const client = sanity()
  if (client) {
    const existing = await client.getDocument(id)
    if (!existing || existing.memberType !== 'associate') return false
    await client.delete(id)
    return true
  }
  const items = await readFileStore()
  const next = items.filter((a) => a.id !== id)
  if (next.length === items.length) return false
  await writeFileStore(next)
  return true
}

export const PHOTO_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}
export const MAX_PHOTO_BYTES = 3 * 1024 * 1024

export async function savePhoto(bytes: Buffer, type: string, originalName: string) {
  const client = sanity()
  if (client) {
    const asset = await client.assets.upload('image', bytes, { filename: originalName, contentType: type })
    return { url: asset.url, assetId: asset._id }
  }
  const dir = path.join(uploadsDir, 'associates')
  await mkdir(dir, { recursive: true })
  const name = `${randomUUID()}.${PHOTO_TYPES[type]}`
  await writeFile(path.join(dir, name), bytes)
  return { url: `/uploads/associates/${name}`, assetId: undefined }
}
