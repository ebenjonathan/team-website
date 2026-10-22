import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/server/rateLimit'
import { configuredEmailProvider } from '@/lib/email'
import { checkoutSchema, createOrder, UnknownItemError } from '@/lib/shop/orders'
import { shopStore, ShopStorageUnavailableError } from '@/lib/shop/store'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, { limit: 5, windowSeconds: 60 })
  if (limited) return limited

  try {
    shopStore()
  } catch (error) {
    if (error instanceof ShopStorageUnavailableError) {
      console.error('[Shop]', error.message)
      return NextResponse.json(
        { success: false, code: 'not_configured', message: 'The shop is temporarily unavailable. Please email info@team.co.zw to order.' },
        { status: 503 },
      )
    }
    throw error
  }

  if (process.env.NODE_ENV === 'production' && !configuredEmailProvider()) {
    console.error('[Shop] No email provider configured; refusing orders so no invoice goes unsent.')
    return NextResponse.json(
      { success: false, code: 'not_configured', message: 'The shop is temporarily unavailable. Please email info@team.co.zw to order.' },
      { status: 503 },
    )
  }

  try {
    const input = checkoutSchema.parse(await request.json().catch(() => null))
    const order = await createOrder(input)
    return NextResponse.json({ success: true, invoiceNumber: order.invoiceNumber, token: order.uploadToken })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.flatten().fieldErrors }, { status: 400 })
    }
    if (error instanceof UnknownItemError) {
      return NextResponse.json({ success: false, message: 'One of the items in your cart is no longer available.' }, { status: 400 })
    }
    console.error('[Shop] Order creation failed:', error)
    return NextResponse.json({ success: false, message: 'We could not place your order. Please try again.' }, { status: 500 })
  }
}
