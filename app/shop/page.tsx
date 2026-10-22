import type { Metadata } from 'next'
import Link from 'next/link'
import { shopBundles, shopProducts, shopProgrammes, shopServices } from '@/lib/data/shop'
import { enquiryHref } from '@/lib/data/enquiry'
import { PageHero, Section, SectionIntro, ArrowLink, EnquiryBand } from '@/components/editorial'
import { ProductCard } from '@/components/shop/ProductCard'
import { orderingSteps, whichPlaybook } from '@/lib/data/shopContent'

export const metadata: Metadata = {
  title: 'Shop: TEAM Culture Engine tools',
  description:
    'Playbooks, a conversation card deck and a pocketbook from the TEAM Culture Engine™ for leaders, managers and Culture Champions. Order online and pay by bank transfer.',
  alternates: { canonical: '/shop' },
}

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="TEAM shop"
        title="Practical tools for leaders, managers and Culture Champions."
        lead="The playbooks, cards and pocketbook from the TEAM Culture Engine™ — the same tools we use in our culture engagements. Order online, pay by bank transfer, and we deliver within 3 working days of payment."
      >
        <ArrowLink href="#products">See the tools</ArrowLink>
        <ArrowLink href="/shop/help">How ordering works</ArrowLink>
      </PageHero>

      <Section id="products">
        <SectionIntro title="The tools" lead="All prices are in US dollars and include VAT." />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {shopProducts.map((p) => (
            <ProductCard key={p.id} item={p} />
          ))}
        </div>
      </Section>

      <Section tone="tint">
        <SectionIntro title="Kits" lead="The tools that work together, at a lower price than buying them separately." />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {shopBundles.map((b) => (
            <ProductCard key={b.id} item={b} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <SectionIntro title="How ordering works" lead="No card payments: you receive an invoice and pay by bank transfer." />
            <div className="mt-6">
              <ArrowLink href="/shop/help">Payment, delivery and returns</ArrowLink>
            </div>
          </div>
          <ol className="lg:col-span-7 divide-y divide-gray-200 border-y border-gray-200">
            {orderingSteps.map((s, i) => (
              <li key={s.title} className="py-5 grid grid-cols-[2.5rem_1fr] gap-2">
                <span className="font-heading font-bold text-primary text-lg">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="font-semibold text-primary-deeper">{s.title}</p>
                  <p className="mt-1 text-body leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="tint">
        <SectionIntro title="Which tool do I need?" />
        <dl className="mt-10 grid md:grid-cols-2 gap-x-12">
          {whichPlaybook.map((w) => (
            <div key={w.need} className="py-5 border-t border-gray-200">
              <dt className="text-body">{w.need}</dt>
              <dd className="mt-1">
                <Link href={`/shop/${w.id}`} className="font-semibold text-primary-deeper hover:underline underline-offset-4">
                  {w.product} <span aria-hidden className="text-primary">→</span>
                </Link>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <SectionIntro
          eyebrow="For organisations"
          title="Rolling the Culture Engine out across your organisation?"
          lead="Our programmes combine the tools with training, coaching and a year of access to the online Culture Engine platform. They are priced for your organisation, so ask us for a proposal."
        />
        <ul className="mt-12 grid md:grid-cols-3 gap-x-10 gap-y-12">
          {shopProgrammes.map((p) => (
            <li key={p.id} className="border-t-2 border-primary-deeper pt-5">
              <h3 className="font-heading font-bold text-xl text-primary-deeper">{p.name}</h3>
              <p className="mt-2 text-body leading-relaxed">{p.summary}</p>
              <div className="mt-4">
                <ArrowLink href={enquiryHref(p.topic)}>Request a proposal</ArrowLink>
              </div>
            </li>
          ))}
        </ul>
        <h3 className="mt-16 font-heading font-bold text-xl text-primary-deeper">Support from our culture practice</h3>
        <ul className="mt-6 grid md:grid-cols-3 gap-x-10 divide-y md:divide-y-0 divide-gray-200 border-y border-gray-200">
          {shopServices.map((s) => (
            <li key={s.id} className="py-5">
              <p className="font-semibold text-primary-deeper">{s.name}</p>
              <p className="mt-1 text-body">{s.summary}</p>
              <div className="mt-3">
                <ArrowLink href={enquiryHref(s.topic)}>Ask about this</ArrowLink>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <EnquiryBand
        title="Need tools for a whole team?"
        body="For 20 or more copies, or to combine the tools with facilitation and coaching, tell us what you need and we will send a proposal."
        topic="tools"
        buttonLabel="Ask for volume pricing"
      />
    </>
  )
}
