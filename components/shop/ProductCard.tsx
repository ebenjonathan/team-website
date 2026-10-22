import Image from 'next/image'
import Link from 'next/link'
import { bundleItemsTotal, type ShopItem } from '@/lib/data/shop'
import { formatUsd } from '@/lib/shop/money'
import { AddToCart } from './ProductActions'

export function ProductCard({ item }: { item: ShopItem }) {
  const href = `/shop/${item.id}`
  return (
    <article className="flex flex-col">
      <Link href={href} className="group relative block aspect-square rounded-xs overflow-hidden bg-[#f3f1ed]">
        <Image
          src={item.images[0].src}
          alt={item.images[0].alt}
          fill
          sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex-1 flex flex-col border-t-2 border-primary-deeper mt-5 pt-4">
        <p className="text-sm font-semibold text-primary">{item.kind === 'bundle' ? 'Bundle' : item.series}</p>
        <h3 className="mt-1.5 font-heading font-bold text-xl text-primary-deeper leading-snug">
          <Link href={href} className="hover:underline underline-offset-4 decoration-2">
            {item.name}
          </Link>
        </h3>
        <p className="mt-2 text-body leading-relaxed">{item.shortDescription}</p>
        <div className="mt-auto pt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="font-heading font-bold text-2xl text-primary-deeper">
            {formatUsd(item.price).replace('.00', '')}
            {item.kind === 'bundle' && (
              <span className="ml-2 text-sm font-sans font-normal text-body/70 line-through">
                {formatUsd(bundleItemsTotal(item)).replace('.00', '')}
              </span>
            )}
          </p>
          <AddToCart id={item.id} name={item.name} withQuantity={false} />
        </div>
      </div>
    </article>
  )
}
