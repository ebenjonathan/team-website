import { readFile } from 'fs/promises'
import path from 'path'

export interface ContactSubmissionRecord {
  timestamp: string
  channel: 'contact' | 'event-registration' | 'newsletter' | 'diagnostic'
  mode: string
  payload: Record<string, unknown>
}

/** Read and parse the local NDJSON submission log */
export async function listContactSubmissions(): Promise<ContactSubmissionRecord[]> {
  const logFile = path.join(process.cwd(), 'logs', 'local-submissions.ndjson')
  try {
    const content = await readFile(logFile, 'utf8')
    return content
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as ContactSubmissionRecord)
      .reverse() // newest first
  } catch {
    return []
  }
}
