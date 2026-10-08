import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ideasAtWorkArticles } from '@/lib/data'
import { serviceTopic, enquiryHref } from '@/lib/data/enquiry'
import { programmes } from '@/lib/data/programmes'
import { getBlogPosts, getCaseStudies, getServiceBySlug, getServiceOfferings } from '@/lib/sanity/content'
import { publicFileExists } from '@/lib/server/publicFile'
import { PageHero, Section, SectionIntro, EnquiryBand, ButtonLink, ArrowLink } from '@/components/editorial'

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  return {
    title: service?.title,
    description: service?.description,
    alternates: { canonical: `/service-offerings/${slug}` },
    openGraph: service
      ? { title: `${service.title} | TEAM Consulting`, description: service.description, url: `/service-offerings/${slug}` }
      : undefined,
  }
}

const DELIVERY_TYPE_LABELS: Record<string, string> = {
  toolkits: 'Toolkits',
  training: 'Training',
  evaluation: 'Evaluation',
  advisory: 'Advisory',
  management: 'Management',
}

export async function generateStaticParams() {
  const services = await getServiceOfferings()
  return services.map((service) => ({ slug: service.slug }))
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params
  const [service, blogPosts, caseStudies, allServices] = await Promise.all([
    getServiceBySlug(slug),
    getBlogPosts(),
    getCaseStudies(),
    getServiceOfferings(),
  ])
  if (!service) notFound()

  const topic = serviceTopic[service.slug] ?? 'general'
  const articles = (Array.isArray(blogPosts) && blogPosts.length ? blogPosts : ideasAtWorkArticles)
    .filter((a: { tags?: string[] }) => a.tags?.includes(service.title))
    .slice(0, 2)
  const stories = caseStudies.filter((c) => c.services?.includes(service.title)).slice(0, 2)
  const others = allServices.filter((s) => s.slug !== service.slug)

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={service.title}
        lead={service.fullDescription ?? service.description}
      >
        <ButtonLink href={enquiryHref(topic)}>Enquire about {service.title.toLowerCase()}</ButtonLink>
        {publicFileExists(service.downloadableProfile) && (
          <ArrowLink href={service.downloadableProfile} external>
            Download the service profile (PDF)
          </ArrowLink>
        )}
      </PageHero>

      <Section className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-6">
          <h2 className="font-heading font-bold text-2xl text-primary-deeper mb-6">What we help with</h2>
          <ul className="divide-y divide-gray-200 border-y border-gray-200">
            {service.features.map((f) => (
              <li key={f} className="py-4 text-lg text-body">{f}</li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6 grid sm:grid-cols-2 gap-10">
          {!!service.benefits?.length && (
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary-deeper mb-6">What changes</h2>
              <ul className="space-y-4">
                {service.benefits.map((b) => (
                  <li key={b} className="border-l-2 border-primary pl-4 text-body leading-relaxed">{b}</li>
                ))}
              </ul>
            </div>
          )}
          {!!service.deliverables?.length && (
            <div>
              <h2 className="font-heading font-bold text-2xl text-primary-deeper mb-6">What you receive</h2>
              <ul className="space-y-4">
                {service.deliverables.map((d) => (
                  <li key={d} className="border-l-2 border-primary-deeper pl-4 text-body leading-relaxed">{d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>

      {service.slug === 'organisation-culture' && (
        <Section bordered>
          <SectionIntro eyebrow="Programmes" title="Develop your people with a structured programme." />
          <div className="mt-10 grid md:grid-cols-3 gap-10">
            {programmes.map((p) => (
              <Link key={p.slug} href={`/programmes/${p.slug}`} className="group border-t-2 border-primary-deeper pt-5">
                <h3 className="font-heading font-bold text-xl text-primary-deeper group-hover:text-primary">{p.name}</h3>
                <p className="mt-2 text-body leading-relaxed">{p.summary}</p>
                <p className="mt-4 font-semibold text-primary-deeper group-hover:text-primary">Explore <span aria-hidden className="text-primary">→</span></p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {!!service.deliveryFramework?.length && (
        <Section tone="tint">
          <SectionIntro
            eyebrow="Delivery framework"
            title={`How we deliver ${service.title.toLowerCase()} work.`}
            lead="Depending on what you need, we bring toolkits, training, evaluation or hands-on advisory support."
          />
          <div className="mt-12 grid md:grid-cols-2 gap-10">
            {service.deliveryFramework.map((sub) => (
              <article key={sub.title} className="border-t-2 border-primary-deeper pt-6">
                <h3 className="font-heading font-bold text-xl text-primary-deeper">{sub.title}</h3>
                {sub.note && <p className="mt-1 text-sm text-primary font-semibold">{sub.note}</p>}
                <dl className="mt-5 space-y-4">
                  {Object.keys(DELIVERY_TYPE_LABELS)
                    .filter((k) => sub.delivery[k as keyof typeof sub.delivery]?.length)
                    .map((k) => (
                      <div key={k} className="grid grid-cols-[110px_1fr] gap-4">
                        <dt className="text-sm text-body/70">{DELIVERY_TYPE_LABELS[k]}</dt>
                        <dd className="text-body">{sub.delivery[k as keyof typeof sub.delivery]!.join(', ')}</dd>
                      </div>
                    ))}
                </dl>
              </article>
            ))}
          </div>
        </Section>
      )}

      {(!!service.notableAssignments?.length || !!stories.length) && (
        <Section>
          <SectionIntro eyebrow="In practice" title="Recent work in this area." />
          {!!service.notableAssignments?.length && (
            <ul className="mt-10 divide-y divide-gray-200 border-y border-gray-200 max-w-4xl">
              {service.notableAssignments.map((a) => (
                <li key={a} className="py-5 text-lg text-body leading-relaxed">{a}</li>
              ))}
            </ul>
          )}
          {!!stories.length && (
            <div className="mt-12 grid md:grid-cols-2 gap-10">
              {stories.map((s) => (
                <Link key={s.id} href={`/ideas-at-work/${s.slug}`} className="group grid grid-cols-[140px_1fr] gap-5">
                  <div className="relative aspect-square overflow-hidden rounded-sm">
                    <Image src={s.image} alt="" fill sizes="140px" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm text-body/70">Case story · {s.client}</p>
                    <h3 className="mt-1 font-heading font-bold text-lg text-primary-deeper group-hover:text-primary leading-snug">{s.title}</h3>
                    <p className="mt-2 text-sm text-body">{s.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Section>
      )}

      {!!articles.length && (
        <Section tone="tint" className="py-12 md:py-16">
          <h2 className="font-heading font-bold text-xl text-primary-deeper mb-6">Related practice notes</h2>
          <ul className="space-y-3">
            {articles.map((a: { id: string; slug: string; title: string }) => (
              <li key={a.id}>
                <ArrowLink href={`/ideas-at-work/articles/${a.slug}`}>{a.title}</ArrowLink>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <EnquiryBand
        title={`Talk to us about ${service.title.toLowerCase()}.`}
        topic={topic}
        buttonLabel={`Enquire about ${service.title.toLowerCase()}`}
      />

      <Section className="py-12 md:py-14">
        <p className="text-sm font-semibold text-body/70 mb-4">Other services</p>
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {others.map((s) => (
            <li key={s.slug}>
              <ArrowLink href={`/service-offerings/${s.slug}`}>{s.title}</ArrowLink>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
