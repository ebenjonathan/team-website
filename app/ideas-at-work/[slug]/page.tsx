import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCaseStudies, getCaseStudyBySlug } from '@/lib/sanity/content'

interface CaseStudyDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(
  { params }: CaseStudyDetailPageProps,
): Promise<Metadata> {
  const resolvedParams = await params
  const study = await getCaseStudyBySlug(resolvedParams.slug)

  return {
    title: study?.title,
    description: study?.summary,
  }
}

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies()

  return caseStudies.map((study) => ({
    slug: study.slug,
  }))
}

export default async function CaseStudyDetailPage(
  { params }: CaseStudyDetailPageProps,
) {
  const resolvedParams = await params
  const study = await getCaseStudyBySlug(resolvedParams.slug)

  const caseStudies = await getCaseStudies()

  if (!study) notFound()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4">
          <p className="text-primary-light font-semibold mb-2">{study.category}</p>
          <h1 className="text-5xl font-bold mb-6">{study.title}</h1>
          <p className="text-xl text-slate-200 max-w-2xl">{study.summary}</p>
        </div>
      </section>

      {/* Case Study Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-12">
              {/* Challenge */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Challenge</h2>
                <p className="text-lg text-slate-600 leading-relaxed">{study.challenge}</p>
              </div>

              {/* Approach */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Approach</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">{study.approach}</p>
              </div>

              {(study.technologies?.frontend?.length || study.technologies?.backend?.length || study.technologies?.infrastructure?.length) && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">Technologies</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {study.technologies?.frontend && (
                      <div>
                        <h3 className="font-bold text-slate-900 mb-4">Frontend</h3>
                        <ul className="space-y-2">
                          {study.technologies.frontend.map((tech, idx) => (
                            <li key={idx} className="text-slate-600">
                              • {tech}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {study.technologies?.backend && (
                      <div>
                        <h3 className="font-bold text-slate-900 mb-4">Backend</h3>
                        <ul className="space-y-2">
                          {study.technologies.backend.map((tech, idx) => (
                            <li key={idx} className="text-slate-600">
                              • {tech}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {study.technologies?.infrastructure && (
                      <div>
                        <h3 className="font-bold text-slate-900 mb-4">Infrastructure</h3>
                        <ul className="space-y-2">
                          {study.technologies.infrastructure.map((tech, idx) => (
                            <li key={idx} className="text-slate-600">
                              • {tech}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Metrics */}
              <div className="bg-slate-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Results</h3>
                <div className="space-y-6">
                  {(study.metrics ?? []).map((metric, idx) => (
                    <div key={idx}>
                      <p className="text-3xl font-bold text-primary">{metric.value}</p>
                      <p className="text-slate-600 mt-1">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services */}
              {study.services && (
                <div className="bg-primary-light p-8 rounded-lg">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Services Used</h3>
                  <ul className="space-y-2">
                    {study.services.map((service, idx) => (
                      <li key={idx} className="text-slate-600">
                        ✓ {service}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <Link
                href="/contact-us"
                className="w-full block text-center bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Case Studies */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">More Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies
              .filter((s) => s.slug !== study.slug)
              .slice(0, 2)
              .map((relatedStudy) => (
                <Link
                  key={relatedStudy.slug}
                  href={`/ideas-at-work/${relatedStudy.slug}`}
                  className="bg-white p-8 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <span className="block text-primary font-semibold mb-2">{relatedStudy.category}</span>
                  <span className="block text-xl font-bold text-slate-900 mb-3">{relatedStudy.title}</span>
                  <span className="block text-slate-600">{relatedStudy.summary}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
