import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/server/rateLimit'
import { getOrderForCustomer, PROOF_MAX_BYTES, PROOF_TYPES, recordProof } from '@/lib/shop/orders'

export const runtime = 'nodejs'

/** Accepts the customer's proof of payment and emails it to the office. */
export async function POST(request: NextRequest, { params }: { params: Promise<{ invoice: string }> }) {
  const limited = await checkRateLimit(request, { limit: 5, windowSeconds: 600 })
  if (limited) return limited

  const { invoice } = await params
  const order = await getOrderForCustomer(invoice, request.nextUrl.searchParams.get('k')).catch(() => null)
  if (!order) return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 })
  if (order.status === 'cancelled') {
    return NextResponse.json({ success: false, message: 'This order was cancelled. Please contact us.' }, { status: 409 })
  }

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ success: false, message: 'Choose a file to upload.' }, { status: 400 })
  }
  if (!PROOF_TYPES[file.type]) {
    return NextResponse.json({ success: false, message: 'Upload a PDF, JPG or PNG file.' }, { status: 400 })
  }
  if (file.size > PROOF_MAX_BYTES) {
    return NextResponse.json({ success: false, message: 'The file is larger than 4 MB. Please email it to us instead.' }, { status: 413 })
  }

  const ok = await recordProof(order, { name: file.name, type: file.type, bytes: new Uint8Array(await file.arrayBuffer()) })
  if (!ok) {
    return NextResponse.json(
      { success: false, message: 'We could not receive your file just now. Please reply to your invoice email with it attached.' },
      { status: 502 },
    )
  }
  return NextResponse.json({ success: true })
}
