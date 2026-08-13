import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { ideasAtWorkArticles } from '@/lib/data'
import { getBlogPosts, getServiceBySlug, getServiceOfferings } from '@/lib/sanity/content'

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(
  { params }: ServiceDetailPageProps,
): Promise<Metadata> {
  const resolvedParams = await params
  const service = await getServiceBySlug(resolvedParams.slug)

  return {
    title: service?.title,
    description: service?.description,
    alternates: { canonical: `/service-offerings/${resolvedParams.slug}` },
    openGraph: service
      ? {
          title: `${service.title} | TEAM Consulting`,
          description: service.description,
          url: `/service-offerings/${resolvedParams.slug}`,
        }
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

  return services.map((service) => ({
    slug: service.slug,
  }))
}

export default async function ServiceDetailPage(
  { params }: ServiceDetailPageProps,
) {
  const resolvedParams = await params
  const [service, blogPosts] = await Promise.all([
    getServiceBySlug(resolvedParams.slug),
    getBlogPosts(),
  ])

  if (!service) notFound()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">{service.title}</h1>
          <p className="text-xl text-slate-200 max-w-2xl">{service.description}</p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-8">Overview</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-12">
            {service.fullDescription ?? service.description}
          </p>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Benefits */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Key Benefits</h3>
              <ul className="space-y-4">
                {(service.benefits ?? service.features).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary font-bold mr-4">✓</span>
                    <span className="text-slate-600 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deliverables */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Deliverables</h3>
              <ul className="space-y-4">
                {(service.deliverables ?? service.features).map((deliverable, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mr-3 mt-0.5" />
                    <span className="text-slate-600 text-lg">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            What&apos;s Included
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {service.features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h4 className="font-bold text-slate-900 text-lg">{feature}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!!service.deliveryFramework?.length && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Delivery Framework</h2>
            <p className="text-lg text-slate-600 mb-12 max-w-3xl">
              How {service.title} is delivered across TEAM Consulting&apos;s service architecture.
            </p>
            <div className="grid gap-8 md:grid-cols-2">
              {service.deliveryFramework.map((subArea) => (
                <article key={subArea.title} className="rounded-xl border border-slate-200 p-6">
                  <h3 className="text-xl font-bold text-slate-900">{subArea.title}</h3>
                  {subArea.note && (
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      {subArea.note}
                    </p>
                  )}
                  <div className="mt-4 space-y-4">
                    {(Object.keys(DELIVERY_TYPE_LABELS) as Array<keyof typeof DELIVERY_TYPE_LABELS>)
                      .filter((key) => subArea.delivery[key as keyof typeof subArea.delivery]?.length)
                      .map((key) => (
                        <div key={key}>
                          <p className="text-sm font-bold text-slate-900">{DELIVERY_TYPE_LABELS[key]}</p>
                          <ul className="mt-1 space-y-1">
                            {subArea.delivery[key as keyof typeof subArea.delivery]!.map((entry) => (
                              <li key={entry} className="text-sm text-slate-600">
                                {entry}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {!!service.notableAssignments?.length && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-slate-900 mb-8">Notable Assignments</h2>
            <ul className="space-y-4 text-slate-700">
              {service.notableAssignments.map((assignment) => (
                <li key={assignment} className="rounded-lg border border-slate-200 p-4">
                  {assignment}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Service Profile</h2>
              <p className="mt-2 text-slate-600">Download the service profile for this intervention area.</p>
              <a
                href={service.downloadableProfile}
                download
                className="mt-4 inline-block rounded-md bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark"
              >
                Download Profile
              </a>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900">Related Ideas @ Work</h2>
              <ul className="mt-4 space-y-3">
                {(Array.isArray(blogPosts) && blogPosts.length ? blogPosts : ideasAtWorkArticles)
                  .filter((article) => article.tags.includes(service.title))
                  .slice(0, 2)
                  .map((article) => (
                    <li key={article.id} className="rounded-lg border border-slate-200 bg-white p-4">
                      <p className="font-semibold text-slate-900">{article.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{article.excerpt}</p>
                      <a href={article.downloadUrl} download className="mt-2 inline-block text-sm font-semibold text-primary">
                        Download Article
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how {service.title} can drive value for your organization.
          </p>
          <Link
            href="/contact-us"
            className="inline-block bg-white text-primary hover:bg-slate-100 font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}
