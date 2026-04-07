import { Metadata } from 'next'
import Link from 'next/link'
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

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-slate-600">Business unit not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">{unit.name}</h1>
          <p className="text-primary-light font-semibold mb-4">{unit.tagline}</p>
          <p className="text-xl text-slate-200 max-w-2xl">{unit.description}</p>
        </div>
      </section>

      {/* Content */}
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
