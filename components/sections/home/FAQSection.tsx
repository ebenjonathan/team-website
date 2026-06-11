import { FAQAccordion } from '@/components/faq/FAQAccordion'
import { faqItems as fallbackFaqItems } from '@/lib/data/faqs'
import { getFaqItems } from '@/lib/sanity/content'

export async function FAQSection() {
  const cmsFaqItems = await getFaqItems()
  const items = (cmsFaqItems.length ? cmsFaqItems : fallbackFaqItems).slice(0, 5)

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <FAQAccordion
            items={items}
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            subtitle="A quick preview of the most common questions clients ask before starting an engagement."
            showSearch={false}
            showCategoryFilter={false}
            footerHref="/faq"
            footerLabel="View All FAQs"
          />
        </div>
      </div>
    </section>
  )
}
