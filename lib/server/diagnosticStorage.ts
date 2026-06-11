import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const diagnosticFile = path.join(dataDir, 'diagnostic-submissions.json')
const blogFile = path.join(dataDir, 'blog-posts.json')
const subscriberFile = path.join(dataDir, 'newsletter-subscribers.json')

async function ensureFile(filePath: string, fallback: string) {
  await mkdir(dataDir, { recursive: true })
  try {
    await readFile(filePath, 'utf8')
  } catch {
    await writeFile(filePath, fallback, 'utf8')
  }
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  await ensureFile(filePath, JSON.stringify(fallback, null, 2))
  const raw = await readFile(filePath, 'utf8')
  return JSON.parse(raw) as T
}

async function writeJson<T>(filePath: string, data: T): Promise<void> {
  await ensureFile(filePath, JSON.stringify([], null, 2))
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

export interface DiagnosticRecord {
  id: string
  timestamp: string
  name: string
  email: string
  businessName: string
  businessType: string
  score: number
  payload: Record<string, unknown>
}

export async function listDiagnosticSubmissions(): Promise<DiagnosticRecord[]> {
  return readJson<DiagnosticRecord[]>(diagnosticFile, [])
}

export async function saveDiagnosticSubmission(record: DiagnosticRecord): Promise<void> {
  const current = await listDiagnosticSubmissions()
  current.unshift(record)
  await writeJson(diagnosticFile, current)
}

export interface BlogPostRecord {
  id: string
  title: string
  excerpt: string
  createdAt: string
}

export async function listBlogPosts(): Promise<BlogPostRecord[]> {
  return readJson<BlogPostRecord[]>(blogFile, [])
}

export async function createBlogPost(post: BlogPostRecord): Promise<void> {
  const current = await listBlogPosts()
  current.unshift(post)
  await writeJson(blogFile, current)
}

export async function updateBlogPost(id: string, patch: Partial<BlogPostRecord>): Promise<BlogPostRecord | null> {
  const current = await listBlogPosts()
  const index = current.findIndex((p) => p.id === id)
  if (index < 0) return null
  current[index] = { ...current[index], ...patch }
  await writeJson(blogFile, current)
  return current[index]
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const current = await listBlogPosts()
  const next = current.filter((p) => p.id !== id)
  if (next.length === current.length) return false
  await writeJson(blogFile, next)
  return true
}

export interface SubscriberRecord {
  id: string
  email: string
  createdAt: string
}

export async function listSubscribers(): Promise<SubscriberRecord[]> {
  return readJson<SubscriberRecord[]>(subscriberFile, [])
}

export async function addSubscriber(rec: SubscriberRecord): Promise<void> {
  const current = await listSubscribers()
  if (!current.some((s) => s.email.toLowerCase() === rec.email.toLowerCase())) {
    current.unshift(rec)
    await writeJson(subscriberFile, current)
  }
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  const current = await listSubscribers()
  const next = current.filter((s) => s.id !== id)
  if (next.length === current.length) return false
  await writeJson(subscriberFile, next)
  return true
}
