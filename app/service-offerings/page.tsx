import { Metadata } from 'next'
import Link from 'next/link'
import { getServiceOfferings } from '@/lib/sanity/content'
import { practiceAreas } from '@/lib/data/services'
import type { Service } from '@/types'
import { SITE_URL as siteUrl } from '@/lib/seo/site'
import { PageHero, Section, SectionIntro, EnquiryBand, ButtonLink, ArrowLink } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'Service Offerings',
  description:
    'One integrated practice across strategy and governance, process and technology, and people and culture.',
  alternates: { canonical: '/service-offerings' },
  openGraph: {
    title: 'Service Offerings | TEAM Consulting',
    description:
      'One integrated practice across strategy and governance, process and technology, and people and culture.',
    url: '/service-offerings',
  },
}

const principles = [
  {
    title: 'Practical advice',
    body: 'We focus on the issues that matter most to your leadership team and to the people who must carry the change.',
  },
  {
    title: 'Measured outcomes',
    body: 'Every engagement is scoped against the GREATER outcomes, so you know what success looks like before we start.',
  },
  {
    title: 'Flexible delivery',
    body: 'Our associate model brings specialist depth without unnecessary overhead, keeping delivery responsive and cost-conscious.',
  },
]

export default async function ServiceOfferingsPage() {
  const services = await getServiceOfferings()
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'TEAM Consulting Service Offerings',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        url: `${siteUrl}/service-offerings/${service.slug}`,
        provider: { '@type': 'Organization', name: 'TEAM Consulting' },
      },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
      <PageHero
        eyebrow="Services"
        title="One practice, not a catalogue."
        lead="Our disciplines connect and build on one another. A strategy engagement flows into organisation design, culture and change; a process redesign can progress into automation. Each is available on its own, but our strength lies in bringing them together, so you work with one advisory partner across the whole arc of change."
      >
        <ButtonLink href="/free-diagnostic">Not sure where to start? Take the diagnostic</ButtonLink>
      </PageHero>

      {practiceAreas.map((area, i) => {
        const items = area.slugs
          .map((slug) => services.find((sv) => sv.slug === slug))
          .filter((sv): sv is Service => !!sv)
        if (!items.length) return null
        return (
          <Section key={area.title} bordered={i > 0} className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
              <p className="text-sm font-semibold text-primary mb-3">Practice area {i + 1}</p>
              <h2 className="font-heading font-bold text-3xl text-primary-deeper leading-tight">{area.title}</h2>
              <ul className="mt-5 space-y-2">
                {area.offerings.map((o) => (
                  <li key={o} className="border-l-2 border-primary pl-3 text-body leading-snug">{o}</li>
                ))}
              </ul>
            </div>
            <ul className="lg:col-span-8 border-t border-gray-300">
              {items.map((service) => (
                <ServiceRow key={service.id} service={service} />
              ))}
            </ul>
          </Section>
        )
      })}

      <Section bordered className="py-12 md:py-14">
        <p className="text-body">
          Looking for courses for your staff?{' '}
          <Link href="/training" className="font-semibold text-primary-deeper underline underline-offset-4 hover:text-primary">
            Browse our training catalogue
          </Link>
          .
        </p>
      </Section>

      <Section tone="tint">
        <SectionIntro eyebrow="How we engage" title="What you can expect from every engagement." />
        <div className="mt-12 grid md:grid-cols-3 gap-10">
          {principles.map((p) => (
            <div key={p.title} className="border-t-2 border-primary-deeper pt-6">
              <h3 className="font-heading font-bold text-xl text-primary-deeper">{p.title}</h3>
              <p className="mt-3 text-body leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <ArrowLink href="/who-we-are">How we work, in more detail</ArrowLink>
        </div>
      </Section>

      <EnquiryBand title="Need help deciding where to start?" body="Tell us the challenge in a sentence or two. We will suggest the right starting point, even if it is not a paid engagement." />
    </>
  )
}

function ServiceRow({ service }: { service: Service }) {
  return (
    <li className="border-b border-gray-300">
      <Link href={`/service-offerings/${service.slug}`} className="group grid md:grid-cols-12 gap-3 md:gap-6 py-7">
        <h3 className="md:col-span-4 font-heading font-bold text-2xl text-primary-deeper group-hover:text-primary leading-tight">
          {service.title}
        </h3>
        <div className="md:col-span-6">
          <p className="text-body leading-relaxed">{service.description}</p>
          {!!service.features.length && (
            <p className="mt-3 text-sm text-body/80 leading-relaxed">{service.features.join('. ')}.</p>
          )}
        </div>
        <span className="md:col-span-2 md:text-right font-semibold text-primary-deeper group-hover:text-primary self-start">
          Explore <span aria-hidden className="text-primary">→</span>
        </span>
      </Link>
    </li>
  )
}
