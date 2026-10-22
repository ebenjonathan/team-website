import { NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/server/requireAuth'
import { shopStore } from '@/lib/shop/store'
import { getRateStatus } from '@/lib/shop/fx'
import { orderUrl } from '@/lib/shop/orders'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const authError = await requireAdminAuth()
  if (authError) return authError

  try {
    const store = shopStore()
    const [orders, settings, fx, fxHistory] = await Promise.all([
      store.listOrders(),
      store.getSettings(),
      getRateStatus({ allowRefresh: false }),
      store.listFxHistory(),
    ])
    return NextResponse.json({
      success: true,
      orders: orders.map((o) => ({ ...o, customerLink: orderUrl(o) })),
      settings,
      fx,
      fxHistory,
    })
  } catch (error) {
    console.error('[Admin shop] load failed:', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to load orders' },
      { status: 500 },
    )
  }
}
