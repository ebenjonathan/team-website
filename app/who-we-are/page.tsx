import { Metadata } from 'next'
import { companyProfile, downloads } from '@/lib/data'
import { SectionHeader } from '@/components/ui'
import { getDownloadResources, getGlobalSettings } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'Who We Are',
  description:
    'TEAM Consulting profile, philosophy, Four Strands foundation, GREATER framework, and Find-Get-Keep approach.',
}

export default async function WhoWeArePage() {
  const [settings, resources] = await Promise.all([getGlobalSettings(), getDownloadResources()])

  const profile = settings ?? companyProfile
  const downloadItems = resources.length ? resources : downloads

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">{profile.name}</h1>
            <p className="text-2xl font-semibold text-primary-light">{profile.tagline}</p>
            <p className="text-xl text-slate-200 mt-6 leading-relaxed">{profile.overview[0]}</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="About TEAM"
            subtitle="Founded in Zimbabwe in 2004 and serving clients across Sub-Saharan Africa"
            centered
          />

          <div className="mx-auto mt-14 max-w-4xl space-y-5 text-lg text-slate-600">
            {profile.overview.map((paragraph: string) => (
              <p key={paragraph} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {profile.stats.map((stat: any) => (
              <article key={stat.id} className="rounded-lg border border-slate-200 p-5 text-center">
                <p className="text-3xl font-bold text-primary">{stat.display}</p>
                <p className="mt-2 text-sm font-medium text-slate-700">{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <SectionHeader title="Our Philosophy" subtitle={profile.philosophy} centered />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {profile.fourStrands.map((strand: any) => (
              <article key={strand.title} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900">{strand.title}</h3>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-primary">{strand.subtitle}</p>
                <p className="mt-3 text-slate-600">{strand.description}</p>
                {strand.reference && (
                  <p className="mt-4 text-sm italic text-slate-500">Reference: {strand.reference}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="The GREATER Framework"
            subtitle="Every engagement is scoped against seven measurable outcomes"
            centered
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {profile.greaterFramework.map((item: any) => (
              <article key={`${item.key}-${item.title}`} className="rounded-lg border border-slate-200 p-5">
                <h3 className="text-xl font-semibold text-slate-900">{item.key} - {item.title}</h3>
                <p className="mt-2 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <SectionHeader title="Find. Get. Keep." subtitle="Our delivery cycle from diagnostics to sustainability" centered />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {profile.approach.map((step: any) => (
              <article key={step.title} className="rounded-xl bg-white p-6">
                <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-primary">{step.phase}</p>
                <p className="mt-3 text-slate-600">{step.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href={downloadItems.find((asset) => asset.id === 'company-profile')?.href}
              download
              className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark"
            >
              Download Company Profile
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Why Choose TEAM"
            subtitle="Over 80% of engagements come from repeat and referral clients"
            centered
          />

          <div className="mx-auto mt-10 max-w-4xl rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-lg text-slate-700">
            TEAM practices vulnerability-based consulting: naming difficult issues candidly, asking the
            questions others avoid, and transferring methods so clients sustain results independently.
          </div>
        </div>
      </section>
    </div>
  )
}
