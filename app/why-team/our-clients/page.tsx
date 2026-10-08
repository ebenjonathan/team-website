import { Metadata } from 'next'
import { companyProfile, sectors } from '@/lib/data'
import { getClientLogoGroups } from '@/lib/images'
import { ClientLogoGrid } from '@/components/ui/ClientLogoGrid'
import { PageHero, Section, SectionIntro, EnquiryBand, ArrowLink } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'Our Clients',
  description: 'Organisations that trust TEAM Consulting for advisory and transformation support.',
  alternates: { canonical: '/why-team/our-clients' },
}

export default async function OurClientsPage() {
  const clientGroups = getClientLogoGroups()

  return (
    <>
      <PageHero
        eyebrow="Clients"
        title="Trusted by banks, insurers, ministries and development partners."
        lead="Since 2004 we have built long relationships with organisations across the public, private and development sectors."
      >
        <ArrowLink href="/why-team/our-success-stories">Read our case stories</ArrowLink>
      </PageHero>

      <Section className="py-10 md:py-12">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {companyProfile.stats.map((s) => (
            <div key={s.id} className="flex flex-col-reverse">
              <dt className="mt-1 text-sm text-body">{s.label}</dt>
              <dd className="font-heading font-bold text-4xl md:text-5xl text-primary-deeper tracking-tight">{s.display}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {clientGroups.length > 0 && (
        <Section tone="tint">
          <SectionIntro eyebrow="Selected clients" title="Some of the organisations we have worked with." className="mb-12" />
          <ClientLogoGrid groups={clientGroups} />
        </Section>
      )}

      <Section>
        <SectionIntro eyebrow="Sectors" title="The sectors we know well." />
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
