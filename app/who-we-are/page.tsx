import Image from 'next/image'
import { Metadata } from 'next'
import { companyProfile, downloads } from '@/lib/data'
import { getDownloadResources, getGlobalSettings } from '@/lib/sanity/content'
import { publicFileExists } from '@/lib/server/publicFile'
import { PageHero, Section, SectionIntro, EnquiryBand, ArrowLink, ButtonLink } from '@/components/editorial'
import { GreaterDial } from '@/components/editorial/GreaterDial'

export const metadata: Metadata = {
  title: 'Who We Are',
  description:
    'TEAM Consulting profile, philosophy, Four Strands foundation, GREATER framework, and Find-Get-Keep approach.',
  alternates: { canonical: '/who-we-are' },
  openGraph: {
    title: 'Who We Are | TEAM Consulting',
    description:
      'TEAM Consulting profile, philosophy, Four Strands foundation, GREATER framework, and Find-Get-Keep approach.',
    url: '/who-we-are',
  },
}

export default async function WhoWeArePage() {
  const [settings, resources] = await Promise.all([getGlobalSettings(), getDownloadResources()])
  const profile = settings ?? companyProfile
  const downloadItems = resources.length ? resources : downloads
  const profilePdf = downloadItems.find((a) => a.id === 'company-profile')?.href
  const stats: { id: string; label: string; display: string }[] = profile.stats

  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="A boutique advisory practice built on one idea: together, we are greater than me."
        lead={
          <p>
            Founded in Harare in 2004, TEAM Consulting helps organisations{' '}
            <strong className="text-primary-deeper">unlock full value in their people, processes and products</strong>, and
            move from intention to impact.
          </p>
        }
      >
        <ButtonLink href="/contact-us#enquiry">Make an enquiry</ButtonLink>
        {publicFileExists(profilePdf) && (
          <ArrowLink href={profilePdf} external>
            Download our company profile (PDF)
          </ArrowLink>
        )}
      </PageHero>

      <Section className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 space-y-5 text-lg text-body leading-relaxed">
          {profile.overview.map((paragraph: string) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <dl className="lg:col-span-5 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-gray-200 pt-8">
          {stats.map((s) => (
            <div key={s.id} className="flex flex-col-reverse">
              <dt className="mt-1 text-sm text-body">{s.label}</dt>
              <dd className="font-heading font-bold text-4xl md:text-5xl text-primary-deeper tracking-tight">{s.display}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <section className="bg-primary-deeper text-white">
        <div className="container mx-auto py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <SectionIntro
              light
              eyebrow="Our philosophy"
              title="We focus on significance, not just value creation."
              lead={profile.philosophy}
            />
          </div>
          <div className="lg:col-span-5 relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image src="/images/corporate/corp-2.webp" alt="Executives in discussion around a boardroom table" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <Section>
        <SectionIntro
          eyebrow="The Four Strands"
          title="The values that shape how we work."
          lead="Every engagement is held to the same four commitments."
        />
        <div className="mt-12 grid md:grid-cols-2 gap-x-12 border-t border-gray-200">
          {profile.fourStrands.map((strand: { title: string; subtitle: string; description: string; reference?: string }) => (
            <article key={strand.title} className="py-8 border-b border-gray-200">
              <h3 className="font-heading font-bold text-2xl text-primary-deeper">{strand.title}</h3>
              <p className="mt-1 font-semibold text-primary">{strand.subtitle}</p>
              <p className="mt-3 text-body leading-relaxed max-w-[52ch]">{strand.description}</p>
              {strand.reference && <p className="mt-3 text-sm text-body/70">{strand.reference}</p>}
            </article>
          ))}
        </div>
      </Section>

      <Section tone="tint" className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <GreaterDial />
        </div>
        <div className="lg:col-span-7 order-1 lg:order-2">
          <SectionIntro
            eyebrow="The GREATER framework"
            title="Seven outcomes we scope every engagement against."
            lead="Growth, resilience, efficiency, agility, thrivability, engagement and results. Together they give leaders a single, measurable picture of organisational health."
          />
          <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {profile.greaterFramework.map((g: { key: string; title: string; description: string }, i: number) => (
              <li key={`${g.title}-${i}`}>
                <p className="font-semibold text-primary-deeper">{g.title}</p>
                <p className="text-sm text-body leading-relaxed">{g.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ArrowLink href="/free-diagnostic">See where you stand with the free diagnostic</ArrowLink>
          </div>
        </div>
      </Section>

      <Section>
        <SectionIntro
          eyebrow="How we work"
          title="Find the value. Get the value. Keep the value."
          lead="Our delivery cycle runs from diagnosis through implementation to the governance that makes change last."
        />
        <ol className="mt-12 grid md:grid-cols-3 gap-10">
          {profile.approach.map((step: { title: string; phase: string; description: string }, i: number) => (
            <li key={step.title} className="border-t-2 border-primary-deeper pt-6">
              <p className="text-sm text-body/70">Stage {i + 1} · {step.phase}</p>
              <h3 className="mt-2 font-heading font-bold text-2xl text-primary-deeper">{step.title}</h3>
              <p className="mt-3 text-body leading-relaxed">{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="tint" className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative aspect-[3/2] overflow-hidden rounded-sm">
          <Image src="/images/corporate/corp-4.webp" alt="A presentation of research findings to a leadership team" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </div>
        <div className="lg:col-span-6">
          <SectionIntro
            eyebrow="Why clients come back"
            title="Consulting that builds your capability, not your dependence on us."
            lead="More than 80% of our work comes from repeat and referral clients. We think that is because we:"
          />
          <ul className="mt-6 divide-y divide-gray-300 border-y border-gray-300">
            {[
              'Say the difficult things early, in a diagnosis that surfaces what others miss.',
              'Transfer our methods, so your team owns the outcome.',
              'Keep senior advisors involved from the first brief to final delivery.',
              'Bring local insight from twelve markets to every recommendation.',
            ].map((p) => (
              <li key={p} className="py-3 text-body leading-relaxed">{p}</li>
            ))}
          </ul>
          <div className="mt-8">
            <ArrowLink href="/why-team/our-team">Meet our leadership</ArrowLink>
          </div>
        </div>
      </Section>

      <EnquiryBand />
    </>
  )
}
