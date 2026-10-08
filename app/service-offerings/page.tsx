import { Metadata } from 'next'
import Link from 'next/link'
import { getServiceOfferings } from '@/lib/sanity/content'
import { SITE_URL as siteUrl } from '@/lib/seo/site'
import { PageHero, Section, SectionIntro, EnquiryBand, ButtonLink, ArrowLink } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'Service Offerings',
  description:
    'Integrated advisory support spanning strategy, governance, people, performance, and implementation.',
  alternates: { canonical: '/service-offerings' },
  openGraph: {
    title: 'Service Offerings | TEAM Consulting',
    description:
      'Integrated advisory support spanning strategy, governance, people, performance, and implementation.',
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
        title="One advisory partner, from strategy to the culture that makes it stick."
        lead="Our practice connects strategy, governance, operations, research, culture and wellbeing, so you can work with one team across the whole arc of change."
      >
        <ButtonLink href="/free-diagnostic">Not sure where to start? Take the diagnostic</ButtonLink>
      </PageHero>

      <Section>
        <ul className="border-t border-gray-300">
          {services.map((service) => (
            <li key={service.id} className="border-b border-gray-300">
              <Link
                href={`/service-offerings/${service.slug}`}
                className="group grid md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-10"
              >
                <h2 className="md:col-span-4 font-heading font-bold text-2xl md:text-3xl text-primary-deeper group-hover:text-primary leading-tight">
                  {service.title}
                </h2>
                <div className="md:col-span-6">
                  <p className="text-lg text-body leading-relaxed">{service.description}</p>
                  {!!service.features.length && (
                    <p className="mt-3 text-sm text-body/80 leading-relaxed">{service.features.join('. ')}.</p>
                  )}
                </div>
                <span className="md:col-span-2 md:text-right font-semibold text-primary-deeper group-hover:text-primary self-start">
                  Explore <span aria-hidden className="text-primary">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
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
