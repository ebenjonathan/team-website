import { Metadata } from 'next'
import Link from 'next/link'
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">{unit.name}</h1>
          <p className="text-primary-light font-semibold mb-4">{unit.tagline}</p>
          <p className="text-xl text-slate-200 max-w-2xl">{unit.description}</p>
        </div>
      </section>

      {/* Sales narrative — persuasive editorial sections */}
      {unit.salesNarrative && unit.salesNarrative.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-14">
              {unit.salesNarrative.map((section, idx) => (
                <div key={idx} className="border-l-4 border-primary pl-8">
                  <h2 className="font-heading font-bold text-2xl text-primary-deeper mb-4 leading-snug">
                    {section.heading}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Narrative overview paragraphs */}
      {unit.narrative && unit.narrative.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="space-y-6">
              {unit.narrative.map((para, idx) => (
                <p key={idx} className="text-lg text-slate-600 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Value Lifecycle */}
      {unit.valueLifecycle && (
        <section className="py-16 bg-primary-light">
          <div className="container mx-auto px-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-8 text-center">
              How We Work With You
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '1', label: 'Find the Value', phase: 'Discovery & Diagnostics', body: unit.valueLifecycle.find },
                { step: '2', label: 'Get the Value', phase: 'Execution & Implementation', body: unit.valueLifecycle.get },
                { step: '3', label: 'Keep the Value', phase: 'Sustainability & Governance', body: unit.valueLifecycle.keep },
              ].map(({ step, label, phase, body }) => (
                <div key={step} className="bg-white rounded-2xl p-8 border border-primary/10 shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm mb-4">
                    {step}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-primary-deeper mb-1">{label}</h3>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">{phase}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Focus Areas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">Our Focus Areas</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <ul className="space-y-6">
                {unit.services.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-primary font-bold text-xl mr-4">✓</span>
                    <span className="text-lg text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-12 rounded-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Unit Lead</h3>
              <p className="text-lg font-semibold text-primary mb-6">{unit.head ?? 'TEAM Consulting Leadership'}</p>

              <h4 className="text-xl font-bold text-slate-900 mb-4">Why This Unit Matters</h4>
              <ul className="space-y-4 text-slate-600">
                <li>✓ Services mapped to GREATER outcomes</li>
                <li>✓ Practical diagnostics and implementation support</li>
                <li>✓ Cross-unit collaboration for complex transformations</li>
                <li>✓ Strong governance and sustainability focus</li>
              </ul>

              <Link href="/contact-us" className="mt-8 inline-block rounded-md bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark">
                Discuss This Unit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
