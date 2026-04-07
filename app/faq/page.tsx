import type { Metadata } from 'next'
import { FaqBot } from '@/components/ui'
import faqSeed from '@/lib/data/faq-seed.json'
import { getFaqItems } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about TEAM services, markets, and delivery model.',
}

export default async function FaqPage() {
  const faqItems = await getFaqItems()
  const items = faqItems.length ? faqItems : faqSeed

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold">Frequently Asked Questions</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            Ask the assistant or browse common answers sourced from our CMS with local fallback.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-2">
        <FaqBot items={items} />

        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-bold text-slate-900">{item.question}</h2>
              <p className="mt-2 text-slate-700">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
