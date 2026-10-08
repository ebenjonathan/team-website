import type { Metadata } from 'next'
import { FAQAccordion } from '@/components/faq/FAQAccordion'
import { PageHero, Section, EnquiryBand } from '@/components/editorial'
import { faqItems as fallbackFaqItems } from '@/lib/data/faqs'
import { getFaqItems } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about TEAM services, markets, and delivery model.',
  alternates: { canonical: '/faq' },
}

export default async function FaqPage() {
  const faqItems = await getFaqItems()
  const items = faqItems.length ? faqItems : fallbackFaqItems
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageHero
        eyebrow="Questions"
        title="Answers to the questions clients ask before working with us."
        lead="How we work, what we cost, where we operate and what to expect. Search below or browse by topic."
      />
      <Section className="max-w-4xl">
        <FAQAccordion items={items} showSearch showCategoryFilter />
      </Section>
      <EnquiryBand
        title="Did not find your answer?"
        body="Ask us directly. A principal consultant will reply within two business days."
        buttonLabel="Ask a question"
      />
    </>
  )
}
