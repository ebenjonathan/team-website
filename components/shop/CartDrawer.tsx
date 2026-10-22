'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { shopSettings } from '@/lib/data/shop'
import { formatUsd } from '@/lib/shop/money'
import { useCart } from './CartProvider'

export function CartButton() {
  const { count, ready, open } = useCart()
  return (
    <button
      onClick={open}
      className="relative p-2 rounded-md hover:bg-gray-100 transition-colors"
      aria-label={ready && count ? `Open cart, ${count} item${count === 1 ? '' : 's'}` : 'Open cart'}
    >
      <ShoppingBag className="w-6 h-6 text-primary-deeper" />
      {ready && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  )
}

export function QuantityStepper({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (n: number) => void
  label: string
}) {
  return (
    <div className="inline-flex items-center border border-gray-300 rounded-md" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className="p-2 text-primary-deeper disabled:text-gray-300"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        min={1}
        max={shopSettings.maxQuantity}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-12 text-center text-sm font-semibold text-primary-deeper bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= shopSettings.maxQuantity}
        className="p-2 text-primary-deeper disabled:text-gray-300"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}

export function BulkNotice({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <p className="text-sm bg-primary-muted text-primary-deeper rounded-md px-3 py-2">
      {shopSettings.bulkOrders.message}{' '}
      <Link href="/contact-us?topic=tools#enquiry" className="font-semibold underline underline-offset-2">
        Contact us
      </Link>
    </p>
  )
}

export function CartDrawer() {
  const { detailed, subtotal, isOpen, close, setQuantity, remove } = useCart()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  if (!isOpen) return null
  const bulk = detailed.some((d) => d.quantity >= shopSettings.bulkOrders.threshold)

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your cart">
      <div className="absolute inset-0 bg-primary-deeper/60" onClick={close} />
      <div className="absolute right-0 top-0 h-full w-[26rem] max-w-full bg-white flex flex-col">
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-gray-200 shrink-0">
          <span className="font-heading font-bold text-lg text-primary-deeper">Your cart</span>
          <button onClick={close} className="p-2 rounded-md hover:bg-gray-100" aria-label="Close cart">
            <X className="w-5 h-5 text-primary-deeper" />
          </button>
        </div>

        {detailed.length === 0 ? (
          <div className="flex-1 px-6 py-10">
            <p className="text-body">Your cart is empty.</p>
            <Link href="/shop" onClick={close} className="mt-4 inline-block font-semibold text-primary-deeper underline underline-offset-4">
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 divide-y divide-gray-200">
              {detailed.map(({ item, quantity, lineTotal }) => (
                <li key={item.id} className="py-5 flex gap-4">
                  <Link href={`/shop/${item.id}`} onClick={close} className="relative w-20 h-20 shrink-0 rounded-xs overflow-hidden bg-[#f3f1ed]">
                    <Image src={item.images[0].src} alt="" fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.id}`} onClick={close} className="font-semibold text-primary-deeper leading-snug hover:underline">
                      {item.name}
                    </Link>
                    <p className="text-sm text-body/70 mt-0.5">{formatUsd(item.price)} each</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QuantityStepper value={quantity} onChange={(n) => setQuantity(item.id, n)} label={`Quantity of ${item.name}`} />
                      <span className="font-semibold text-primary-deeper">{formatUsd(lineTotal)}</span>
                    </div>
                    <button onClick={() => remove(item.id)} className="mt-2 text-sm text-body/70 hover:text-red-700 underline underline-offset-2">
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 px-6 py-5 space-y-4 shrink-0">
              <BulkNotice show={bulk} />
              <div className="flex items-baseline justify-between">
                <span className="text-body">Subtotal (incl. VAT)</span>
                <span className="font-heading font-bold text-xl text-primary-deeper">{formatUsd(subtotal)}</span>
              </div>
              <p className="text-sm text-body/70">Delivery is chosen at checkout. You pay by bank transfer after receiving your invoice.</p>
              <Link
                href="/shop/checkout"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-md font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Continue to checkout <span aria-hidden>→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
