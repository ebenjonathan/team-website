import type { Metadata } from 'next'
import { PageHero, Section, ArrowLink } from '@/components/editorial'
import { orderingSteps, policySections, shopFaqs } from '@/lib/data/shopContent'
import { shopSettings } from '@/lib/data/shop'

export const metadata: Metadata = {
  title: 'Ordering, payment and delivery | Shop',
  description: 'How to order TEAM Culture Engine tools: invoices, bank transfer in US dollars or rand, delivery and returns.',
  alternates: { canonical: '/shop/help' },
}

export default function ShopHelpPage() {
  return (
    <>
      <PageHero
        eyebrow="Shop help"
        title="Ordering, payment and delivery."
        lead="Everything you need to know before you order. Still have a question? Email us and we will help."
      >
        <ArrowLink href="/shop">Back to the shop</ArrowLink>
        <ArrowLink href={`mailto:${shopSettings.seller.email}`} external>
          {shopSettings.seller.email}
        </ArrowLink>
      </PageHero>

      <Section>
        <h2 className="font-heading font-bold text-3xl text-primary-deeper">How ordering works</h2>
        <ol className="mt-8 grid md:grid-cols-5 gap-6">
          {orderingSteps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-primary-deeper pt-4">
              <span className="font-heading font-bold text-primary">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-2 font-semibold text-primary-deeper">{s.title}</p>
              <p className="mt-1 text-sm text-body leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {policySections.map((section, i) => (
        <Section key={section.title} tone={i % 2 === 0 ? 'tint' : 'white'}>
          <div className="grid lg:grid-cols-12 gap-8">
            <h2 className="lg:col-span-4 font-heading font-bold text-3xl text-primary-deeper">{section.title}</h2>
            <ul className="lg:col-span-8 divide-y divide-gray-200 border-y border-gray-200">
              {section.points.map((p) => (
                <li key={p.slice(0, 40)} className="py-4 leading-relaxed text-body">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ))}

      <Section>
        <h2 className="font-heading font-bold text-3xl text-primary-deeper">Frequently asked questions</h2>
        <dl className="mt-8 divide-y divide-gray-200 border-y border-gray-200 max-w-4xl">
          {shopFaqs.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-semibold text-primary-deeper">{f.q}</dt>
              <dd className="mt-1.5 text-body leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  )
}
