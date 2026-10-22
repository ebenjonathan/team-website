import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { sendEmail } from '@/lib/email'
import { getRateStatus, refreshRate } from '@/lib/shop/fx'
import { fxAlertEmail } from '@/lib/shop/emails'
import { adminEmailAddress, adminUrl, runOrderHousekeeping } from '@/lib/shop/orders'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function authorised(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return process.env.NODE_ENV === 'development'
  const given = Buffer.from(request.headers.get('authorization') ?? '')
  const expected = Buffer.from(`Bearer ${secret}`)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

/**
 * Daily shop job, run by Vercel Cron at 06:00 Harare time (see vercel.json):
 * refreshes the rand rate, sends payment reminders and expires unpaid invoices.
 */
export async function GET(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ success: false }, { status: 401 })

  const fx = await refreshRate()
  const status = await getRateStatus({ allowRefresh: false })
  if (!fx.ok || !status.inUse) {
    const message = !fx.ok ? fx.message : status.problem ?? 'No usable exchange rate.'
    await sendEmail({ to: adminEmailAddress(), ...fxAlertEmail(message, adminUrl()) })
  }

  const housekeeping = await runOrderHousekeeping()
  return NextResponse.json({ success: true, fx: fx.ok ? fx.snapshot : { error: fx.message }, ...housekeeping })
}
