import { mkdir, appendFile } from 'fs/promises'
import path from 'path'

export type SubmissionChannel = 'contact' | 'event-registration' | 'newsletter'

interface SubmissionLogEntry {
  channel: SubmissionChannel
  payload: Record<string, unknown>
  mode: 'local-fallback' | 'resend' | 'sendgrid' | 'mailchimp'
}

export async function writeLocalSubmissionLog(entry: SubmissionLogEntry) {
  const logsDir = path.join(process.cwd(), 'logs')
  const logFile = path.join(logsDir, 'local-submissions.ndjson')

  await mkdir(logsDir, { recursive: true })

  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...entry,
  })

  await appendFile(logFile, `${line}\n`, 'utf8')
}
