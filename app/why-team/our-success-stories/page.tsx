import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getCaseStudies } from '@/lib/sanity/content'
import { PageHero, Section, EnquiryBand } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'Case Stories',
  description: 'What TEAM Consulting did, and what changed, in recent engagements.',
  alternates: { canonical: '/why-team/our-success-stories' },
}

export default async function SuccessStoriesPage() {
  const stories = await getCaseStudies()

  return (
    <>
      <PageHero
        eyebrow="Case stories"
        title="What we did, and what changed."
        lead="A selection of recent engagements across the public and private sectors."
      />
      <Section>
        <ul className="space-y-16">
          {stories.map((s, i) => (
            <li key={s.id}>
              <Link href={`/ideas-at-work/${s.slug}`} className="group grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className={`lg:col-span-5 relative aspect-[3/2] overflow-hidden rounded-sm ${i % 2 ? 'lg:order-2' : ''}`}>
                  <Image src={s.image} alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
                </div>
                <div className="lg:col-span-7">
                  <p className="text-sm text-body/70">{s.category} · {s.client}</p>
                  <h2 className="mt-2 font-heading font-bold text-2xl md:text-3xl text-primary-deeper group-hover:text-primary leading-tight">
                    {s.title}
                  </h2>
                  <p className="mt-4 text-body leading-relaxed">{s.summary}</p>
                  {!!s.metrics?.length && (
                    <dl className="mt-6 grid grid-cols-3 gap-6 border-t border-gray-300 pt-5">
                      {s.metrics.slice(0, 3).map((m) => (
                        <div key={m.label} className="flex flex-col-reverse">
                          <dt className="text-sm text-body/70">{m.label}</dt>
                          <dd className="font-semibold text-primary-deeper">{m.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <p className="mt-6 font-semibold text-primary-deeper group-hover:text-primary">
                    Read the case story <span aria-hidden className="text-primary">→</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <EnquiryBand title="Facing a similar challenge?" />
    </>
  )
}
