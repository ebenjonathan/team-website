import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { uploadsDir } from '@/lib/server/associatesStore'

const TYPES: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

// Serves photos uploaded from the admin dashboard (file storage mode).
export async function GET(_req: NextRequest, { params }: { params: { path: string[] } }) {
  const target = path.normalize(path.join(uploadsDir, ...params.path))
  const type = TYPES[path.extname(target).toLowerCase()]
  if (!target.startsWith(uploadsDir + path.sep) || !type) {
    return new NextResponse('Not found', { status: 404 })
  }
  try {
    const body = await readFile(target)
    return new NextResponse(body, {
      headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
