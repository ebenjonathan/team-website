import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminAuth } from '@/lib/server/requireAuth'
import { shopStore } from '@/lib/shop/store'
import { adminActionSchema, applyAdminAction, OrderActionError } from '@/lib/shop/orders'

export const runtime = 'nodejs'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ invoice: string }> }) {
  const authError = await requireAdminAuth()
  if (authError) return authError

  const { invoice } = await params
  const order = await shopStore().getOrder(invoice)
  if (!order) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })

  try {
    const action = adminActionSchema.parse(await request.json().catch(() => null))
    const updated = await applyAdminAction(order, action)
    return NextResponse.json({ success: true, order: updated })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 })
    if (error instanceof OrderActionError) return NextResponse.json({ success: false, message: error.message }, { status: 409 })
    console.error('[Admin shop] action failed:', error)
    return NextResponse.json({ success: false, message: 'Action failed' }, { status: 500 })
  }
}
