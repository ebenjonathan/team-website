import type { Metadata } from 'next'
import { BusinessDiagnosticTool } from '@/components/forms/BusinessDiagnosticTool'
import { PageHero, Section } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'Free Diagnostic',
  description:
    'Run a high-level organisational diagnostic aligned to the GREATER framework and receive a downloadable summary report.',
  alternates: { canonical: '/free-diagnostic' },
}

export default function FreeDiagnosticPage() {
  return (
    <>
      <PageHero
        eyebrow="Free diagnostic"
        title="See where your organisation stands, in five short steps."
        lead="Answer a few plain questions about how you plan, run and grow. You will get an immediate score, the gaps that matter most and practical next steps to download. It is free, with no obligation."
      />
      <Section>
        <BusinessDiagnosticTool />
      </Section>
    </>
  )
}
