import { NextResponse } from 'next/server'
import { listDiagnosticSubmissions } from '@/lib/server/diagnosticStorage'
import { requireAdminAuth } from '@/lib/server/requireAuth'

export async function GET() {
  const authError = await requireAdminAuth()
  if (authError) return authError

  try {
    const submissions = await listDiagnosticSubmissions()
    return NextResponse.json({ success: true, submissions })
  } catch (error) {
    console.error('Admin submissions fetch error:', error)
    return NextResponse.json({ success: false, message: 'Failed to load submissions' }, { status: 500 })
  }
}
