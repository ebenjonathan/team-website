import type { Metadata } from 'next'
import Link from 'next/link'
import { companyProfile, downloads } from '@/lib/data'
import { getDownloadResources, getGlobalSettings } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'Free Diagnostic',
  description:
    'Run a high-level organisational diagnostic aligned to the GREATER framework and receive a downloadable summary report.',
}

export default async function FreeDiagnosticPage() {
  const [settings, resources] = await Promise.all([getGlobalSettings(), getDownloadResources()])

  const profile = settings ?? companyProfile
  const downloadItems = resources.length ? resources : downloads

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold">Free GREATER Diagnostic</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            Every engagement begins with a GREATER diagnostic. Use this quick self-assessment to identify
            gaps and prioritise high-impact interventions.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900">Diagnostic Dimensions</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {profile.greaterFramework.map((item: any) => (
            <article key={`${item.key}-${item.title}`} className="rounded-lg border border-slate-200 p-5">
              <h3 className="text-xl font-semibold text-slate-900">
                {item.key} - {item.title}
              </h3>
              <p className="mt-2 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-2xl font-bold text-slate-900">Get the Questionnaire</h3>
          <p className="mt-2 text-slate-700">
            Download the Phase 1 questionnaire and submit it through the contact page for a guided review.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            {downloadItems
              .filter((item) => item.id === 'diagnostic-form')
              .map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  download
                  className="rounded-md bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
                >
                  Download Questionnaire
                </a>
              ))}
            <Link
              href="/contact-us"
              className="rounded-md border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-900 transition hover:border-slate-400"
            >
              Request a Facilitated Diagnostic
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
