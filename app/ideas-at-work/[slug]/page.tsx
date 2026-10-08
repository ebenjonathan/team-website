import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCaseStudies, getCaseStudyBySlug } from '@/lib/sanity/content'
import { serviceTopic, enquiryHref } from '@/lib/data/enquiry'
import { serviceAreas } from '@/lib/data'
import { PageHero, Section, EnquiryBand, ButtonLink } from '@/components/editorial'

interface CaseStudyDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CaseStudyDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const study = await getCaseStudyBySlug(slug)
  return { title: study?.title, description: study?.summary }
}

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies()
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export default async function CaseStudyDetailPage({ params }: CaseStudyDetailPageProps) {
  const { slug } = await params
  const [study, caseStudies] = await Promise.all([getCaseStudyBySlug(slug), getCaseStudies()])
  if (!study) notFound()

  const mainService = serviceAreas.find((s) => s.title === study.services?.[0])
  const topic = (mainService && serviceTopic[mainService.slug]) || 'general'
  const related = caseStudies.filter((s) => s.slug !== study.slug).slice(0, 2)

  return (
    <>
      <PageHero eyebrow={`Case story · ${study.category}`} title={study.title} lead={study.summary} />

      <Section className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <article className="lg:col-span-8 space-y-12">
          {study.image && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
              <Image src={study.image} alt="" fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
            </div>
          )}
          {study.challenge && (
            <div>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary-deeper">The challenge</h2>
              <p className="mt-4 text-lg text-body leading-relaxed max-w-[68ch]">{study.challenge}</p>
            </div>
          )}
          {study.approach && (
            <div>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary-deeper">What we did</h2>
              <p className="mt-4 text-lg text-body leading-relaxed max-w-[68ch]">{study.approach}</p>
            </div>
          )}
        </article>

        <aside className="lg:col-span-4 lg:border-l lg:border-gray-200 lg:pl-10 space-y-10">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-body/70">Client</dt>
              <dd className="font-semibold text-primary-deeper">{study.client}</dd>
            </div>
            <div>
              <dt className="text-sm text-body/70">Duration</dt>
              <dd className="font-semibold text-primary-deeper">{study.duration}</dd>
            </div>
            {!!study.services?.length && (
              <div>
                <dt className="text-sm text-body/70">Services</dt>
                <dd className="font-semibold text-primary-deeper">{study.services.join(', ')}</dd>
              </div>
            )}
          </dl>
          {!!study.metrics?.length && (
            <div>
              <h2 className="font-semibold text-primary-deeper mb-3">Results</h2>
              <dl className="divide-y divide-gray-200 border-y border-gray-200">
                {study.metrics.map((m) => (
                  <div key={m.label} className="py-3 flex justify-between gap-4">
                    <dt className="text-body">{m.label}</dt>
                    <dd className="font-semibold text-primary-deeper text-right">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <ButtonLink href={enquiryHref(topic)}>Discuss a similar challenge</ButtonLink>
        </aside>
      </Section>

      {!!related.length && (
        <Section tone="tint">
          <h2 className="font-heading font-bold text-2xl text-primary-deeper mb-8">More case stories</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {related.map((r) => (
              <Link key={r.slug} href={`/ideas-at-work/${r.slug}`} className="group border-t-2 border-primary-deeper pt-5">
                <p className="text-sm text-body/70">{r.category}</p>
                <h3 className="mt-1 font-heading font-bold text-xl text-primary-deeper group-hover:text-primary">{r.title}</h3>
                <p className="mt-2 text-body">{r.summary}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}
      <EnquiryBand topic={topic} />
    </>
  )
}
