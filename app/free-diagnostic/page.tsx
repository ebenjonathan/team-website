import type { Metadata } from 'next'
import { BusinessDiagnosticTool } from '@/components/forms/BusinessDiagnosticTool'

export const metadata: Metadata = {
  title: 'Free Diagnostic',
  description:
    'Run a high-level organisational diagnostic aligned to the GREATER framework and receive a downloadable summary report.',
  alternates: { canonical: '/free-diagnostic' },
}

export default function FreeDiagnosticPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-primary-deeper py-20 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold">Free GREATER Diagnostic</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            Assess your organisation across Growth, Revenue, Execution, Automation, Talent,
            Experience, and Strategy. Get immediate scoring, insights, financial impact estimates,
            and practical recommendations.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 rounded-xl border border-primary/20 bg-primary-light p-5 text-sm text-slate-700">
          Each dimension uses a 1-5 maturity scale. Complete every step to generate your consulting-grade diagnostic report.
        </div>

        <BusinessDiagnosticTool />
      </section>
    </div>
  )
}
