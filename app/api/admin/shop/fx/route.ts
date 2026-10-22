import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/server/requireAuth'
import { refreshRate } from '@/lib/shop/fx'

export const runtime = 'nodejs'

/** "Update now" button in the admin exchange-rate panel. */
export async function POST() {
  const authError = await requireAdminAuth()
  if (authError) return authError

  const result = await refreshRate()
  return NextResponse.json(result.ok ? { success: true, snapshot: result.snapshot } : { success: false, message: result.message })
}
