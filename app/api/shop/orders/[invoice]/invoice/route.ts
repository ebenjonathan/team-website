import { NextRequest, NextResponse } from 'next/server'
import { getOrderForCustomer, orderUrl } from '@/lib/shop/orders'
import { renderInvoicePdf } from '@/lib/shop/invoicePdf'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, { params }: { params: Promise<{ invoice: string }> }) {
  const { invoice } = await params
  const order = await getOrderForCustomer(invoice, request.nextUrl.searchParams.get('k')).catch(() => null)
  if (!order) return new NextResponse('Not found', { status: 404 })

  const pdf = await renderInvoicePdf(order, orderUrl(order))
  return new NextResponse(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${order.invoiceNumber}.pdf"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
