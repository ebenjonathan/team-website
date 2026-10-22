import type { Metadata } from 'next'
import Link from 'next/link'
import { shopSettings } from '@/lib/data/shop'
import { formatUsd, formatZar, longDate, shortDate } from '@/lib/shop/money'
import { getOrderForCustomer, invoicePdfPath } from '@/lib/shop/orders'
import { statusLabels, type Order } from '@/lib/shop/types'
import { ProofUpload } from '@/components/shop/ProofUpload'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your order | Shop',
  robots: { index: false, follow: false },
}

function statusLine(o: Order): string {
  const collect = o.delivery.id === 'collect'
  switch (o.status) {
    case 'paid':
      return `Paid – ${collect ? 'ready for collection' : 'delivery'} by ${o.expectedDeliveryDate ? longDate(o.expectedDeliveryDate) : 'soon'}`
    case 'dispatched':
      return collect ? 'Ready for collection' : statusLabels.dispatched
    default:
      return statusLabels[o.status]
  }
}

function BankCard({ title, amount, rows, note }: { title: string; amount: string; rows: [string, string][]; note?: string }) {
  return (
    <div className="rounded-xs border border-primary p-5">
      <p className="text-sm font-semibold text-primary">{title}</p>
      <p className="mt-1 font-heading font-bold text-2xl text-primary-deeper">{amount}</p>
      <dl className="mt-3 space-y-1 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-2">
            <dt className="text-body/70">{k}</dt>
            <dd className={k === 'Account no.' ? 'font-semibold text-primary-deeper' : 'text-primary-deeper'}>{v}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="mt-3 text-xs text-body/70">{note}</p>}
    </div>
  )
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ invoice: string }>
  searchParams: Promise<{ k?: string; new?: string }>
}) {
  const { invoice } = await params
  const { k, new: isNew } = await searchParams
  const order = await getOrderForCustomer(decodeURIComponent(invoice), k).catch(() => null)

  if (!order) {
    return (
      <section className="bg-white">
        <div className="container mx-auto py-20">
          <h1 className="font-heading font-bold text-3xl text-primary-deeper">Order not found</h1>
          <p className="mt-4 text-body max-w-[60ch]">
            Please use the link in your invoice email. If you need help, email{' '}
            <a href={`mailto:${shopSettings.seller.email}`} className="underline">
              {shopSettings.seller.email}
            </a>
            .
          </p>
        </div>
      </section>
    )
  }

  const zb = shopSettings.banks.find((b) => b.id === 'zb-usd')!
  const fnb = shopSettings.banks.find((b) => b.id === 'fnb-zar')!
  const awaiting = ['awaiting_payment', 'proof_received', 'expired'].includes(order.status)

  return (
    <section className="bg-white">
      <div className="container mx-auto py-12 md:py-16">
        <p className="text-sm font-semibold text-primary mb-3">
          <span aria-hidden>— </span>Order {order.invoiceNumber}
        </p>
        <h1 className="font-heading font-bold text-primary-deeper text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.02em]">
          {isNew ? 'Thank you – your invoice has been emailed to you' : `Your order: ${statusLine(order)}`}
        </h1>
        <p className="mt-4 text-lg text-body max-w-[62ch]">
          {isNew
            ? `We have sent invoice ${order.invoiceNumber} to ${order.customer.email}. Keep this page: it shows your order status and is where you upload your proof of payment.`
            : `Placed on ${shortDate(order.createdAt)}.`}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href={invoicePdfPath(order)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold bg-primary text-white hover:bg-primary-dark"
          >
            Download invoice (PDF)
          </a>
          <span className="inline-flex items-center rounded-full bg-primary-muted px-3 py-1 text-sm font-semibold text-primary-deeper">
            Status: {statusLine(order)}
          </span>
        </div>

        {order.status === 'expired' && (
          <p className="mt-6 rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-amber-900">
            This invoice expired on {shortDate(order.validUntil)}. If you have already paid, upload your proof of payment below. Otherwise,
            please <Link href="/shop" className="underline">place a new order</Link>.
          </p>
        )}

        <div className="mt-12 grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-10">
            {awaiting && (
              <div>
                <h2 className="font-heading font-bold text-2xl text-primary-deeper">
                  {order.totalZar ? 'Pay into either account' : 'Pay by bank transfer'}
                </h2>
                <p className="mt-2 text-body">
                  Use <span className="font-semibold text-primary-deeper">{order.invoiceNumber}</span> as your payment reference. This
                  invoice is valid until {shortDate(order.validUntil)}.
                </p>
                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                  <BankCard
                    title="Zimbabwe · US$"
                    amount={formatUsd(order.total)}
                    rows={[
                      ['Bank', zb.bankName],
                      ['Account name', zb.accountName],
                      ['Account no.', zb.accountNumber],
                      ['Branch', zb.branch],
                    ]}
                  />
                  {order.totalZar && order.zarPerUsd && (
                    <BankCard
                      title="South Africa · ZAR"
                      amount={formatZar(order.totalZar)}
                      rows={[
                        ['Bank', fnb.bankName],
                        ['Account name', fnb.accountName],
                        ['Account no.', fnb.accountNumber],
                        ['Branch code', fnb.branchCode ?? ''],
                        ['SWIFT', fnb.swiftCode ?? ''],
                      ]}
                      note={`Rand amount at R${order.zarPerUsd} per US$, fixed until ${shortDate(order.validUntil)}.`}
                    />
                  )}
                </div>
              </div>
            )}

            {order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'dispatched' && order.status !== 'paid' && (
              <ProofUpload invoiceNumber={order.invoiceNumber} token={order.uploadToken} alreadySent={!!order.proof} />
            )}

            {order.status === 'cancelled' && (
              <p className="text-body">This order was cancelled. If you think this is a mistake, email {shopSettings.seller.email}.</p>
            )}

            <div>
              <h2 className="font-heading font-bold text-2xl text-primary-deeper">What happens next</h2>
              <ol className="mt-4 space-y-3 text-body list-decimal pl-5">
                <li className={order.status !== 'awaiting_payment' && order.status !== 'expired' ? 'text-body/60 line-through' : ''}>
                  Pay the amount shown, using your invoice number as the reference.
                </li>
                <li className={order.proof ? 'text-body/60 line-through' : ''}>Upload your proof of payment above, or reply to your invoice email with it attached.</li>
                <li className={order.paidAt ? 'text-body/60 line-through' : ''}>We confirm your payment by email.</li>
                <li>{order.delivery.promise}.</li>
              </ol>
            </div>
          </div>

          <aside className="lg:col-span-5 rounded-xs border border-gray-200 p-6 bg-primary-light">
            <h2 className="font-heading font-bold text-xl text-primary-deeper">Order summary</h2>
            <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
              {order.items.map((i) => (
                <li key={i.id} className="py-3 flex justify-between gap-4">
                  <span className="text-primary-deeper">
                    {i.quantity} × {i.name}
                  </span>
                  <span className="font-semibold text-primary-deeper whitespace-nowrap">{formatUsd(i.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-body">{order.delivery.label}</dt>
                <dd className="text-primary-deeper">{order.deliveryFee ? formatUsd(order.deliveryFee) : 'Free'}</dd>
              </div>
              <div className="flex justify-between border-t border-primary-deeper pt-3 mt-3 text-base">
                <dt className="font-semibold text-primary-deeper">Total (incl. VAT)</dt>
                <dd className="font-heading font-bold text-xl text-primary-deeper">{formatUsd(order.total)}</dd>
              </div>
              <div className="flex justify-between text-body/70">
                <dt>Includes VAT at {order.vatRatePercent}%</dt>
                <dd>{formatUsd(order.vat)}</dd>
              </div>
            </dl>
            {order.delivery.address && (
              <p className="mt-5 text-sm text-body">
                <span className="font-semibold text-primary-deeper">Deliver to: </span>
                {order.delivery.address}
              </p>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
