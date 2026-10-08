import type { Metadata } from 'next'
import Image from 'next/image'
import { clientHallOfFame, footprintCountries, sectors } from '@/lib/data'
import { PageHero, Section, SectionIntro, EnquiryBand, ArrowLink } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'Markets & Clients',
  description: 'Sectors served, geographic footprint, and client experience across international markets.',
  alternates: { canonical: '/our-markets-clients' },
  openGraph: {
    title: 'Markets & Clients | TEAM Consulting',
    description: 'Sectors served, geographic footprint, and client experience across international markets.',
    url: '/our-markets-clients',
  },
}

export default function OurMarketsClientsPage() {
  const countries = [...footprintCountries, 'Spain']
  return (
    <>
      <PageHero
        eyebrow="Markets and clients"
        title="Rooted in Harare. Working across twelve countries."
        lead="We have worked with private, public and development organisations since 2004, building long relationships through practical advisory support."
      />

      <Section className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6">
          <SectionIntro eyebrow="Where we work" title="A regional footprint with a local lens." />
          <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-x-6 border-t border-gray-300">
            {countries.map((c) => (
              <li key={c} className="py-3 border-b border-gray-300 text-primary-deeper font-semibold">{c}</li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6">
          <Image
            src="/images/map.png"
            alt="Map of Africa highlighting the southern and eastern African countries where TEAM works"
            width={2401}
            height={2606}
            sizes="(min-width:1024px) 40vw, 90vw"
            className="w-full h-auto max-w-[460px] mx-auto"
          />
        </div>
      </Section>

      <Section tone="tint">
        <SectionIntro
          eyebrow="Client hall of fame"
          title="Organisations we have delivered for."
          lead="Since inception we have completed assignments across government, financial services, manufacturing, mining and energy, health and development agencies."
        />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {Object.entries(clientHallOfFame).map(([category, names]) => (
            <div key={category} className="border-t-2 border-primary-deeper pt-5">
              <h3 className="font-heading font-bold text-xl text-primary-deeper">{category}</h3>
              <ul className="mt-3 space-y-1.5 text-body">
                {names.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <ArrowLink href="/why-team/our-clients">See client logos by sector</ArrowLink>
        </div>
      </Section>

      <Section>
        <SectionIntro eyebrow="Sectors" title="Fifteen sectors, one consistent approach." />
        <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 border-t border-gray-300">
          {sectors.map((s) => (
            <li key={s} className="py-4 border-b border-gray-300 text-body">{s}</li>
          ))}
        </ul>
      </Section>

      <EnquiryBand />
    </>
  )
}
