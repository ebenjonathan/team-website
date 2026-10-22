import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  bundleItemsTotal,
  deliveryPromise,
  findProduct,
  findShopItem,
  shopItems,
  shopSettings,
  type ShopBundle,
  type ShopProduct,
} from '@/lib/data/shop'
import { formatUsd } from '@/lib/shop/money'
import { Section, SectionIntro, ArrowLink } from '@/components/editorial'
import { AddToCart, ProductGallery } from '@/components/shop/ProductActions'
import { ProductCard } from '@/components/shop/ProductCard'
import { SITE_URL } from '@/lib/seo/site'

export function generateStaticParams() {
  return shopItems.map((i) => ({ id: i.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const item = findShopItem(id)
  if (!item) return {}
  return {
    title: `${item.name} | Shop`,
    description: item.shortDescription,
    alternates: { canonical: `/shop/${item.id}` },
    openGraph: { images: [{ url: item.images[0].src, alt: item.images[0].alt }] },
  }
}

const price = (n: number) => formatUsd(n).replace('.00', '')

function Breadcrumb({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-body/70">
      <Link href="/shop" className="hover:underline">
        Shop
      </Link>
      <span aria-hidden> / </span>
      <span className="text-primary-deeper">{name}</span>
    </nav>
  )
}

function BuyBox({ item }: { item: ShopProduct | ShopBundle }) {
  const promise = deliveryPromise(shopSettings.delivery.options.find((o) => o.id === 'harare'))
  return (
    <div className="mt-8 border-y border-gray-200 py-6">
      <p className="font-heading font-bold text-3xl text-primary-deeper">
        {price(item.price)}
        <span className="ml-2 text-sm font-sans font-normal text-body/70">incl. VAT</span>
      </p>
      {item.kind === 'bundle' && (
        <p className="mt-1 text-body">
          <span className="line-through text-body/60">{price(bundleItemsTotal(item))}</span> if bought separately
        </p>
      )}
      <div className="mt-5">
        <AddToCart id={item.id} name={item.name} />
      </div>
      <p className="mt-4 text-sm text-body/80">{promise} in Harare. Pay by bank transfer in US$ or rand.</p>
    </div>
  )
}

function productJsonLd(item: ShopProduct | ShopBundle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    description: item.shortDescription,
    image: item.images.map((i) => `${SITE_URL}${i.src}`),
    brand: { '@type': 'Brand', name: 'TEAM Consulting' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: item.price.toFixed(2),
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/shop/${item.id}`,
    },
  }
}

export default async function ShopItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = findShopItem(id)
  if (!item) notFound()

  const related =
    item.kind === 'product'
      ? item.pairsWith.map(findProduct).filter((p): p is ShopProduct => !!p)
      : item.items.map(findProduct).filter((p): p is ShopProduct => !!p)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(item)) }} />
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto pt-10 pb-14 md:pt-14 md:pb-20">
          <Breadcrumb name={item.name} />
          <div className="mt-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <ProductGallery images={item.images} alternates={item.kind === 'product' ? item.alternateImages : undefined} />
            <div>
              <p className="text-sm font-semibold text-primary">{item.kind === 'bundle' ? 'Kit' : item.series}</p>
              <h1 className="mt-2 font-heading font-bold text-primary-deeper text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.02em]">
                {item.name}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-body">{item.shortDescription}</p>
              <BuyBox item={item} />

              {item.kind === 'product' ? (
                <div className="mt-8 space-y-4 text-body leading-relaxed">
                  {item.description.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                  <p>
                    <span className="font-semibold text-primary-deeper">Best for: </span>
                    {item.bestFor}
                  </p>
                  {item.note && <p className="text-sm bg-primary-muted text-primary-deeper rounded-md px-4 py-3">{item.note}</p>}
                </div>
              ) : (
                <div className="mt-8">
                  <h2 className="font-heading font-bold text-xl text-primary-deeper">In this kit</h2>
                  <ul className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
                    {related.map((p) => (
                      <li key={p.id} className="py-3 flex items-center justify-between gap-4">
                        <Link href={`/shop/${p.id}`} className="font-semibold text-primary-deeper hover:underline">
                          {p.name}
                        </Link>
                        <span className="text-body/70">{price(p.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {item.kind === 'product' && (item.whatsInside.length > 0 || item.modules) && (
        <Section>
          <div className="grid lg:grid-cols-12 gap-12">
            {item.whatsInside.length > 0 && (
              <div className="lg:col-span-7">
                <SectionIntro title="What’s inside" />
                <ul className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
                  {item.whatsInside.map((w) => (
                    <li key={w.slice(0, 40)} className="py-4 leading-relaxed">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="lg:col-span-5">
              {item.modules && (
                <>
                  <h2 className="font-heading font-bold text-2xl text-primary-deeper">The twelve modules</h2>
                  <ol className="mt-6 grid gap-2">
                    {item.modules.map((m, i) => (
                      <li key={m} className="grid grid-cols-[2.25rem_1fr]">
                        <span className="font-semibold text-primary">{String(i + 1).padStart(2, '0')}</span>
                        <span className="text-primary-deeper">{m}</span>
                      </li>
                    ))}
                  </ol>
                </>
              )}
              <h2 className="mt-10 font-heading font-bold text-2xl text-primary-deeper">Details</h2>
              <dl className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
                {item.specs.map((s) => (
                  <div key={s.label} className="py-3 grid grid-cols-[8rem_1fr] gap-4">
                    <dt className="text-body/70">{s.label}</dt>
                    <dd className="font-semibold text-primary-deeper">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Section>
      )}

      {item.kind === 'product' && related.length > 0 && (
        <Section tone="tint">
          <SectionIntro title="Pairs well with" />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
            {related.map((p) => (
              <ProductCard key={p.id} item={p} />
            ))}
          </div>
        </Section>
      )}

      <Section>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <ArrowLink href="/shop">Back to the shop</ArrowLink>
          <ArrowLink href="/shop/help">Payment, delivery and returns</ArrowLink>
        </div>
      </Section>
    </>
  )
}

