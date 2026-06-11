import Image from 'next/image'
import { Metadata } from 'next'
import { companyProfile, downloads } from '@/lib/data'
import { SectionHeader } from '@/components/ui'
import { getDownloadResources, getGlobalSettings } from '@/lib/sanity/content'
import { PresenceMap } from '@/components/ui/PresenceMap'

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
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">{profile.name}</h1>
            <p className="text-2xl font-semibold text-primary-light">{profile.tagline}</p>
            <p className="text-xl text-slate-200 mt-6 leading-relaxed">{profile.overview[0]}</p>
          </div>
        </div>
      </section>

      {/* Full-width photo strip */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src="/images/corporate/corp-2.webp"
          alt="African professionals at work"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-deeper/60 via-transparent to-primary-deeper/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em] mb-2">
              Pan-African Expertise
            </p>
            <p className="text-white text-2xl md:text-3xl font-bold font-heading max-w-md leading-snug">
              Where African organisations come to grow.
            </p>
          </div>
        </div>
      </div>

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

          <div className="mt-12 relative left-1/2 w-screen max-w-none -translate-x-1/2 px-4">
            <Image
              src="/images/greater.png"
              alt="Greater visual"
              width={2000}
              height={1200}
              priority
              className="w-full h-auto object-contain"
            />
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
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-72 md:h-[460px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/corporate/corp-4.webp"
                alt="TEAM consultants at a client strategy session"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-deeper/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-bold text-xl font-heading leading-snug">
                  80%+ of engagements from repeat &amp; referral clients
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
                Why Choose TEAM
              </p>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary-deeper mb-6 leading-tight">
                Consulting that Transfers, <span className="text-primary">Not Just Advises</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                TEAM practices vulnerability-based consulting: naming difficult issues candidly,
                asking the questions others avoid, and transferring methods so clients sustain
                results independently.
              </p>
              <ul className="space-y-4">
                {[
                  'Candid diagnostics that surface what others miss',
                  'Methodology transfer — your team owns the outcome',
                  'Senior consultants from first brief to final delivery',
                  'Deep cultural roots across Sub-Saharan markets',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-slate-600">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Geographical Presence"
            subtitle="Serving clients across Sub-Saharan Africa and beyond"
            centered
          />
          <div className="mt-12">
            <PresenceMap />
          </div>
        </div>
      </section>
    </div>
  )
}
