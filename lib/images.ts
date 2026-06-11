import fs from 'fs'
import path from 'path'

const IMAGE_EXTS = /\.(png|jpg|jpeg|webp|svg|gif)$/i

function toLabel(filename: string): string {
  return filename
    .replace(IMAGE_EXTS, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Returns all logo files from /public/images/partner */
export function getPartnerLogos(): { src: string; alt: string }[] {
  const dir = path.join(process.cwd(), 'public', 'images', 'partner')
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXTS.test(f))
      .map((f) => ({ src: `/images/partner/${f}`, alt: toLabel(f) }))
  } catch {
    return []
  }
}

export interface ClientLogoGroup {
  sector: string
  logos: { src: string; alt: string }[]
}

/** Returns logos grouped by subfolder under /public/images/clients */
export function getClientLogoGroups(): ClientLogoGroup[] {
  const dir = path.join(process.cwd(), 'public', 'images', 'clients')
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => ({
        sector: d.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        logos: fs
          .readdirSync(path.join(dir, d.name))
          .filter((f) => IMAGE_EXTS.test(f))
          .map((f) => ({
            src: `/images/clients/${d.name}/${f}`,
            alt: toLabel(f),
          })),
      }))
      .filter((g) => g.logos.length > 0)
  } catch {
    return []
  }
}
