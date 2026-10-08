import { existsSync } from 'fs'
import path from 'path'

/** True when a /public path (e.g. '/downloads/x.pdf') exists, so we never show broken download links. */
export function publicFileExists(href?: string | null): href is string {
  if (!href || !href.startsWith('/')) return false
  try {
    return existsSync(path.join(process.cwd(), 'public', decodeURIComponent(href)))
  } catch {
    return false
  }
}
