import type { Metadata } from 'next'
import { FAQAccordion } from '@/components/faq/FAQAccordion'
import { FaqBot } from '@/components/ui'
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
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="bg-primary-deeper py-20 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold">Frequently Asked Questions</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            Search by keyword, filter by category, or ask the assistant for the most relevant answer.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 py-16 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)] lg:items-start">
        <FAQAccordion
          items={items}
          eyebrow="Knowledge Base"
          title="Browse All 30 FAQs"
          subtitle="Each answer is sourced from the TEAM knowledge base and grouped for faster scanning."
          showSearch
          showCategoryFilter
        />

        <div className="space-y-6 lg:sticky lg:top-24">
          <FaqBot items={items} />

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-bold text-slate-900">Need a tailored answer?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              If your question is not covered here, use the contact page and the team will respond directly.
            </p>
            <a
              href="/contact-us"
              className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
