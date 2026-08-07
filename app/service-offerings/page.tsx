import { Metadata } from 'next'
import Link from 'next/link'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getBusinessUnits, getServiceOfferings } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'Service Offerings',
  description:
    'Integrated advisory support spanning strategy, governance, people, performance, and implementation.',
}

export default async function ServiceOfferingsPage() {
  const [businessUnits, services] = await Promise.all([
    getBusinessUnits(),
    getServiceOfferings(),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.teamadvisory.com'
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
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      {/* Hero */}
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Service Offerings</h1>
          <p className="text-xl text-slate-200 max-w-2xl">
            Our integrated practice connects strategy, governance, analytics, human capital, and wellness
            so clients can engage one advisory partner across the full transformation arc.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Integrated Practice"
            subtitle="We connect strategy, governance, performance, and implementation through one trusted partner"
            centered
          />

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Practical advisory</h3>
                <p className="mt-2 text-slate-600">We focus on the issues that matter most to your leadership team and the people who must carry the change forward.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Measured outcomes</h3>
                <p className="mt-2 text-slate-600">Every engagement is shaped around clarity, accountability, and the conditions needed for sustainable performance.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Flexible delivery</h3>
                <p className="mt-2 text-slate-600">Our associate model brings specialist depth without unnecessary overhead, keeping delivery responsive and cost-conscious.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="What We Offer"
            subtitle="End-to-end support for organisations navigating change with confidence"
            centered
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Need Help Prioritising?</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Start with a practical diagnostic to identify quick wins and map the right service pathway.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/free-diagnostic"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Start Free Diagnostic
            </Link>
            <Link
              href="/contact-us"
              className="inline-block border border-slate-300 hover:border-slate-400 text-slate-900 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Speak to a Consultant
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

