import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { programmes, programmeBySlug } from '@/lib/data/programmes'
import { enquiryHref } from '@/lib/data/enquiry'
import { PageHero, Section, SectionIntro, EnquiryBand, ButtonLink, SpecList } from '@/components/editorial'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return programmes.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = programmeBySlug(slug)
  if (!p) return {}
  return { title: p.name, description: p.summary, alternates: { canonical: `/programmes/${slug}` } }
}

export default async function ProgrammePage({ params }: Props) {
  const { slug } = await params
  const p = programmeBySlug(slug)
  if (!p) notFound()
  const others = programmes.filter((o) => o.slug !== p.slug)

  return (
    <>
      <PageHero eyebrow="Lead your teams" title={p.name} lead={p.summary}>
        <ButtonLink href={enquiryHref(p.topic)}>Enquire about {p.shortName.toLowerCase()}</ButtonLink>
      </PageHero>

      <Section className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="text-lg text-body leading-relaxed">{p.intro}</p>
          <SpecList rows={p.formats} />
        </div>
        <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-10">
          <div>
            <h2 className="font-heading font-bold text-xl text-primary-deeper mb-4">Who it is for</h2>
            <ul className="divide-y divide-gray-200 border-y border-gray-200">
              {p.forWho.map((x) => (
                <li key={x} className="py-3 text-body">{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl text-primary-deeper mb-4">What changes</h2>
            <ul className="space-y-3">
              {p.outcomes.map((x) => (
                <li key={x} className="border-l-2 border-primary pl-4 text-body leading-relaxed">{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="tint">
        <SectionIntro
          eyebrow="What it covers"
          title="Built around your organisation, not a standard syllabus."
          lead="Every programme is tailored after a short diagnostic of your goals, culture and people. A typical design includes:"
        />
        <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-8">
          {p.modules.map((m) => (
            <div key={m.title} className="border-t-2 border-primary-deeper pt-5">
              <h3 className="font-heading font-bold text-xl text-primary-deeper">{m.title}</h3>
              <p className="mt-2 text-body leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {!!p.evidence?.length && (
        <Section>
          <SectionIntro eyebrow="In practice" title="Where we have done this work." />
          <ul className="mt-8 divide-y divide-gray-200 border-y border-gray-200 max-w-4xl">
            {p.evidence.map((e) => (
              <li key={e} className="py-4 text-lg text-body">{e}</li>
            ))}
          </ul>
        </Section>
      )}

      <EnquiryBand
        title={`Plan ${p.shortName.toLowerCase()} for your organisation.`}
        body="Tell us about your people, your goals and your timing. We will suggest a design and give you a clear proposal."
        topic={p.topic}
        buttonLabel={`Enquire about ${p.shortName.toLowerCase()}`}
      />

      <Section className="py-12 md:py-14">
        <p className="text-sm font-semibold text-body/70 mb-4">Other programmes</p>
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/programmes/${o.slug}`} className="font-semibold text-primary-deeper hover:text-primary">
                {o.name} <span aria-hidden className="text-primary">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
