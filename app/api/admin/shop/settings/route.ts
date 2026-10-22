import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminAuth } from '@/lib/server/requireAuth'
import { shopStore } from '@/lib/shop/store'

export const runtime = 'nodejs'

const settingsSchema = z.object({
  markupPercent: z.number().min(0).max(20),
  manualOverride: z.number().positive().max(1000).nullable(),
  holidays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(100),
})

export async function PUT(request: NextRequest) {
  const authError = await requireAdminAuth()
  if (authError) return authError

  const parsed = settingsSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Check the values: markup 0–20%, rate above 0, holidays as YYYY-MM-DD.' }, { status: 400 })
  }
  const settings = { ...parsed.data, holidays: [...new Set(parsed.data.holidays)].sort() }
  await shopStore().saveSettings(settings)
  return NextResponse.json({ success: true, settings })
}
