import { NextResponse } from 'next/server'
import { getRateStatus } from '@/lib/shop/fx'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Current rand rate for the checkout summary. The order itself is priced on the server. */
export async function GET() {
  try {
    const status = await getRateStatus()
    return NextResponse.json(
      { zarPerUsd: status.inUse?.rate ?? null },
      { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=600' } },
    )
  } catch {
    return NextResponse.json({ zarPerUsd: null })
  }
}
