import { NextResponse } from 'next/server'
import { listContactSubmissions } from '@/lib/server/contactSubmissions'
import { requireAdminAuth } from '@/lib/server/requireAuth'

export async function GET() {
  const authError = await requireAdminAuth()
  if (authError) return authError

  try {
    const submissions = await listContactSubmissions()
    return NextResponse.json({ success: true, submissions })
  } catch (error) {
    console.error('Contact submissions fetch error:', error)
    return NextResponse.json({ success: false, message: 'Failed to load submissions' }, { status: 500 })
  }
}
