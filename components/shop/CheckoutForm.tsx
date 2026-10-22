'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { availableDeliveryOptions, shopSettings } from '@/lib/data/shop'
import { computeTotals, formatUsd, formatZar } from '@/lib/shop/money'
import { cn } from '@/lib/utils'
import { useCart } from './CartProvider'
import { BulkNotice, QuantityStepper } from './CartDrawer'

type Errors = Partial<Record<string, string>>

const inputCls =
  'mt-1.5 w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-primary-deeper focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'

function Field({
  label,
  name,
  error,
  optional,
  children,
}: {
  label: string
  name: string
  error?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-primary-deeper">
        {label} {optional && <span className="font-normal text-body/60">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

export function CheckoutForm() {
  const router = useRouter()
  const { detailed, lines, ready, setQuantity, remove, clear } = useCart()
  const options = availableDeliveryOptions()
  const [deliveryId, setDeliveryId] = useState(options.find((o) => o.id === 'harare')?.id ?? options[0]?.id ?? '')
  const [rate, setRate] = useState<number | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetch('/api/shop/rate')
      .then((r) => r.json())
      .then((d: { zarPerUsd: number | null }) => setRate(d.zarPerUsd))
      .catch(() => setRate(null))
  }, [])

  const option = options.find((o) => o.id === deliveryId)
  const totals = useMemo(
    () =>
      computeTotals(
        detailed.map((d) => ({ unitPrice: d.item.price, quantity: d.quantity })),
        option?.price ?? 0,
        shopSettings.tax.vatRatePercent,
        rate,
      ),
    [detailed, option, rate],
  )

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError('')
    const data = new FormData(e.currentTarget)
    const body = {
      items: lines,
      name: String(data.get('name') ?? ''),
      company: String(data.get('company') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      taxNumber: String(data.get('taxNumber') ?? ''),
      deliveryId,
      address: option?.needsAddress ? String(data.get('address') ?? '') : '',
      notes: String(data.get('notes') ?? ''),
      acceptTerms: data.get('acceptTerms') === 'on',
      website: String(data.get('website') ?? ''),
    }

    const next: Errors = {}
    if (body.name.trim().length < 2) next.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(body.email.trim())) next.email = 'Enter a valid email address.'
    if (body.phone.trim().length < 7) next.phone = 'Enter a phone number.'
    if (option?.needsAddress && body.address.trim().length < 5) next.address = 'Enter a delivery address.'
    if (!body.acceptTerms) next.acceptTerms = 'Please tick this box to continue.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/shop/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean
        invoiceNumber?: string
        token?: string
        message?: string
        errors?: Record<string, string[]>
      }
      if (res.ok && json.success && json.invoiceNumber && json.token) {
        clear()
        router.push(`/shop/order/${encodeURIComponent(json.invoiceNumber)}?k=${encodeURIComponent(json.token)}&new=1`)
        return
      }
      if (json.errors) {
        setErrors(Object.fromEntries(Object.entries(json.errors).map(([k, v]) => [k, v?.[0] ?? 'Check this field.'])))
      }
      setFormError(
        res.status === 429
          ? 'Too many attempts. Please wait a minute and try again.'
          : json.message ?? 'Please check the highlighted fields and try again.',
      )
    } catch {
      setFormError('We could not reach the shop. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!ready) return <p className="text-body">Loading your cart…</p>

  if (detailed.length === 0) {
    return (
      <div>
        <p className="text-lg text-body">Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block font-semibold text-primary-deeper underline underline-offset-4">
          Browse the shop
        </Link>
      </div>
    )
  }

  const bulk = detailed.some((d) => d.quantity >= shopSettings.bulkOrders.threshold)

  return (
    <form
      onSubmit={onSubmit}
      onChange={(e) => {
        const name = (e.target as HTMLInputElement).name
        if (name && errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
      }}
      noValidate
      className="grid lg:grid-cols-12 gap-12 items-start"
    >
      <div className="lg:col-span-7 space-y-10">
        <fieldset className="space-y-5">
          <legend className="font-heading font-bold text-2xl text-primary-deeper mb-2">Your details</legend>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name" name="name" error={errors.name}>
              <input id="name" name="name" autoComplete="name" required className={inputCls} aria-invalid={!!errors.name} />
            </Field>
            <Field label="Company" name="company" optional error={errors.company}>
              <input id="company" name="company" autoComplete="organization" className={inputCls} />
            </Field>
            <Field label="Email" name="email" error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" required className={inputCls} aria-invalid={!!errors.email} />
            </Field>
            <Field label="Phone" name="phone" error={errors.phone}>
              <input id="phone" name="phone" type="tel" autoComplete="tel" required className={inputCls} aria-invalid={!!errors.phone} />
            </Field>
            <Field label="TIN or VAT number" name="taxNumber" optional error={errors.taxNumber}>
              <input id="taxNumber" name="taxNumber" className={inputCls} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-heading font-bold text-2xl text-primary-deeper mb-2">Delivery</legend>
          <div className="space-y-2">
            {options.map((o) => (
              <label
                key={o.id}
                className={cn(
                  'flex items-start gap-3 rounded-md border px-4 py-3 cursor-pointer',
                  deliveryId === o.id ? 'border-primary bg-primary-light' : 'border-gray-300',
                )}
              >
                <input
                  type="radio"
                  name="deliveryOption"
                  value={o.id}
                  checked={deliveryId === o.id}
                  onChange={() => setDeliveryId(o.id)}
                  className="mt-1 accent-[#09947d]"
                />
                <span className="flex-1">
                  <span className="font-semibold text-primary-deeper">{o.label}</span>
                  <span className="block text-sm text-body/80">{o.promise ?? shopSettings.delivery.promise}</span>
                </span>
                <span className="font-semibold text-primary-deeper">{o.price ? formatUsd(o.price) : 'Free'}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-body/70">
            Outside Harare or in South Africa?{' '}
            <Link href="/contact-us?topic=tools#enquiry" className="underline underline-offset-2">
              Contact us
            </Link>{' '}
            and we will arrange a courier.
          </p>
          {option?.needsAddress && (
            <Field label="Delivery address" name="address" error={errors.address}>
              <textarea id="address" name="address" rows={3} autoComplete="street-address" className={inputCls} aria-invalid={!!errors.address} />
            </Field>
          )}
          <Field label="Notes" name="notes" optional>
            <textarea id="notes" name="notes" rows={2} className={inputCls} placeholder="For example, who to ask for on delivery" />
          </Field>
        </fieldset>

        {/* Honeypot for bots: hidden from people and screen readers */}
        <div aria-hidden className="hidden">
          <label>
            Website <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div>
          <label className="flex items-start gap-3">
            <input type="checkbox" name="acceptTerms" className="mt-1 accent-[#09947d]" aria-invalid={!!errors.acceptTerms} />
            <span className="text-body">
              I understand my order will be confirmed once payment is received. I have read the{' '}
              <Link href="/shop/help" target="_blank" className="underline underline-offset-2">
                payment, delivery and returns terms
              </Link>
              .
            </span>
          </label>
          {errors.acceptTerms && <p className="mt-1 text-sm text-red-700">{errors.acceptTerms}</p>}
        </div>
      </div>

      <aside className="lg:col-span-5 lg:sticky lg:top-28 rounded-xs border border-gray-200 p-6 bg-primary-light">
        <h2 className="font-heading font-bold text-xl text-primary-deeper">Order summary</h2>
        <ul className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
          {detailed.map(({ item, quantity, lineTotal }) => (
            <li key={item.id} className="py-4 flex gap-3">
              <div className="relative w-14 h-14 shrink-0 rounded-xs overflow-hidden bg-[#f3f1ed]">
                <Image src={item.images[0].src} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-primary-deeper leading-snug">{item.name}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <QuantityStepper value={quantity} onChange={(n) => setQuantity(item.id, n)} label={`Quantity of ${item.name}`} />
                  <span className="font-semibold text-primary-deeper">{formatUsd(lineTotal)}</span>
                </div>
                <button type="button" onClick={() => remove(item.id)} className="mt-1 text-sm text-body/70 underline underline-offset-2">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2">
          <div className="flex justify-between">
            <dt className="text-body">Subtotal</dt>
            <dd className="text-primary-deeper">{formatUsd(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-body">Delivery</dt>
            <dd className="text-primary-deeper">{totals.deliveryFee ? formatUsd(totals.deliveryFee) : 'Free'}</dd>
          </div>
          <div className="flex justify-between border-t border-primary-deeper pt-3 mt-3">
            <dt className="font-semibold text-primary-deeper">Total (incl. VAT)</dt>
            <dd className="font-heading font-bold text-2xl text-primary-deeper">{formatUsd(totals.total)}</dd>
          </div>
          <div className="flex justify-between text-sm text-body/70">
            <dt>Includes VAT at {shopSettings.tax.vatRatePercent}%</dt>
            <dd>{formatUsd(totals.vat)}</dd>
          </div>
        </dl>
        {totals.totalZar && (
          <p className="mt-3 text-sm text-body">
            or <span className="font-semibold text-primary-deeper">{formatZar(totals.totalZar)}</span> if paying into our South African
            account. Your invoice fixes the rate for 7 days.
          </p>
        )}
        <div className="mt-4">
          <BulkNotice show={bulk} />
        </div>
        {formError && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {formError}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full px-6 py-3.5 rounded-md font-semibold bg-primary text-white hover:bg-primary-dark disabled:opacity-60 transition-colors"
        >
          {submitting ? 'Creating your invoice…' : 'Get invoice'}
        </button>
        <p className="mt-3 text-sm text-body/70">
          Your invoice is emailed straight away. Pay by bank transfer within 7 days to confirm your order.
        </p>
      </aside>
    </form>
  )
}
