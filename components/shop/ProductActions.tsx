'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useCart } from './CartProvider'
import { QuantityStepper } from './CartDrawer'

export function AddToCart({ id, name, withQuantity = true }: { id: string; name: string; withQuantity?: boolean }) {
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)
  return (
    <div className="flex flex-wrap items-center gap-3">
      {withQuantity && <QuantityStepper value={quantity} onChange={(n) => setQuantity(Math.max(1, Math.min(99, n || 1)))} label={`Quantity of ${name}`} />}
      <button
        type="button"
        onClick={() => add(id, withQuantity ? quantity : 1)}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
      >
        Add to cart
      </button>
    </div>
  )
}

export function ProductGallery({
  images,
  alternates = [],
}: {
  images: { src: string; alt: string }[]
  alternates?: { src: string; alt: string; label: string }[]
}) {
  const all = [...images, ...alternates]
  const [active, setActive] = useState(0)
  const current = all[active] ?? all[0]
  return (
    <div>
      <div className="relative aspect-square rounded-xs overflow-hidden bg-[#f3f1ed]">
        <Image src={current.src} alt={current.alt} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-contain" />
      </div>
      {all.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {all.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  'relative block w-full aspect-square rounded-xs overflow-hidden bg-[#f3f1ed] border-2',
                  i === active ? 'border-primary' : 'border-transparent hover:border-gray-300',
                )}
                aria-label={`Show image ${i + 1}: ${img.alt}`}
                aria-pressed={i === active}
              >
                <Image src={img.src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
