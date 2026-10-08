import { Metadata } from 'next'
import { PageHero, Section, SectionIntro, EnquiryBand, ButtonLink, ArrowLink } from '@/components/editorial'
import { notFound } from 'next/navigation'
import { getBusinessUnitBySlug, getBusinessUnits } from '@/lib/sanity/content'

interface BusinessUnitPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(
  { params }: BusinessUnitPageProps,
): Promise<Metadata> {
  const resolvedParams = await params
  const unit = await getBusinessUnitBySlug(resolvedParams.slug)

  return {
    title: unit?.name,
    description: unit?.description,
  }
}

export async function generateStaticParams() {
  const businessUnits = await getBusinessUnits()

  return businessUnits.map((unit) => ({
    slug: unit.slug,
  }))
}

export default async function BusinessUnitPage(
  { params }: BusinessUnitPageProps,
) {
  const resolvedParams = await params
  const unit = await getBusinessUnitBySlug(resolvedParams.slug)

  if (!unit) notFound()

  return (
    <>
      <PageHero eyebrow={unit.name} title={unit.tagline} lead={unit.description}>
        <ButtonLink href="/contact-us#enquiry">Talk to us about {unit.name}</ButtonLink>
      </PageHero>

      {!!unit.narrative?.length && (
        <Section className="max-w-3xl space-y-6">
          {unit.narrative.map((para, idx) => (
            <p key={idx} className="text-lg text-body leading-[1.75]">{para}</p>
          ))}
        </Section>
      )}

      {unit.valueLifecycle && (
        <Section tone="tint">
          <SectionIntro eyebrow="How we work with you" title="Find the value. Get the value. Keep the value." />
          <ol className="mt-12 grid md:grid-cols-3 gap-10">
            {[
              { label: 'Find the value', phase: 'Discovery & diagnostics', body: unit.valueLifecycle.find },
              { label: 'Get the value', phase: 'Execution & implementation', body: unit.valueLifecycle.get },
              { label: 'Keep the value', phase: 'Sustainability & governance', body: unit.valueLifecycle.keep },
            ].map((step, i) => (
              <li key={step.label} className="border-t-2 border-primary-deeper pt-6">
                <p className="text-sm text-body/70">Stage {i + 1} · {step.phase}</p>
                <h3 className="mt-2 font-heading font-bold text-xl text-primary-deeper">{step.label}</h3>
                <p className="mt-3 text-body leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {!!unit.salesNarrative?.length && (
        <Section className="max-w-3xl space-y-14">
          {unit.salesNarrative.map((section, idx) => (
            <div key={idx}>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary-deeper leading-snug">{section.heading}</h2>
              <p className="mt-4 text-lg text-body leading-[1.75]">{section.body}</p>
            </div>
          ))}
        </Section>
      )}

      <Section tone="tint" className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <SectionIntro eyebrow="Focus areas" title={`What ${unit.name} covers.`} />
          <ul className="mt-8 divide-y divide-gray-300 border-y border-gray-300">
            {unit.services.map((item) => (
              <li key={item} className="py-4 text-lg text-primary-deeper font-semibold">{item}</li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5 lg:border-l lg:border-gray-300 lg:pl-12">
          <p className="text-sm text-body/70">Unit lead</p>
          <p className="mt-1 font-heading font-bold text-2xl text-primary-deeper">{unit.head ?? 'TEAM Consulting leadership'}</p>
          <div className="mt-6">
            <ArrowLink href="/why-team/our-team">Meet our leadership</ArrowLink>
          </div>
        </div>
      </Section>

      <EnquiryBand />
    </>
  )
}
