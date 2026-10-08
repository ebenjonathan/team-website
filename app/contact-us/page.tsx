import { Metadata } from 'next'
import { ContactForm } from '@/components/forms/ContactForm'
import { FAQAccordion } from '@/components/faq/FAQAccordion'
import { PageHero, Section, SectionIntro } from '@/components/editorial'
import { downloads } from '@/lib/data'
import { faqItems as fallbackFaqItems } from '@/lib/data/faqs'
import { isEnquiryTopic } from '@/lib/data/enquiry'
import { getDownloadResources, getFaqItems } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Make an enquiry with TEAM Consulting in Harare, Zimbabwe. We reply within two business days.',
  alternates: { canonical: '/contact-us' },
  openGraph: {
    title: 'Contact Us | TEAM Consulting',
    description: 'Make an enquiry with TEAM Consulting in Harare, Zimbabwe.',
    url: '/contact-us',
  },
}

export default async function ContactUsPage({
  searchParams,
}: {
  searchParams?: { topic?: string }
}) {
  const [downloadResources, faqItems] = await Promise.all([getDownloadResources(), getFaqItems()])
  const faqList = faqItems.length ? faqItems : fallbackFaqItems
  const topic = isEnquiryTopic(searchParams?.topic) ? searchParams.topic : 'general'
  const files = downloadResources.length ? downloadResources : downloads

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you are working on."
        lead="Whether you have a clear brief or just a problem you want to talk through, start here. A principal consultant reads every enquiry and replies within two business days."
      />

      <Section className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div id="enquiry" className="lg:col-span-7 scroll-mt-28">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary-deeper mb-8">
            Make an enquiry
          </h2>
          <ContactForm defaultTopic={topic} />
        </div>

        <aside className="lg:col-span-5 lg:border-l lg:border-gray-200 lg:pl-12 space-y-10">
          <div>
            <h2 className="font-semibold text-primary-deeper mb-3">Talk to us directly</h2>
            <address className="not-italic space-y-2 text-body">
              <p>
                <a href="tel:+263772202290" className="font-semibold text-primary-deeper hover:text-primary">
                  +263 77 220 2290
                </a>
              </p>
              <p>
                <a href="mailto:info@team.co.zw" className="hover:text-primary">info@team.co.zw</a>
              </p>
              <p>Harare, Zimbabwe</p>
              <p>Monday to Friday, 08:00 to 16:30 CAT</p>
            </address>
          </div>

          <div>
            <h2 className="font-semibold text-primary-deeper mb-3">What happens next</h2>
            <ol className="space-y-3 text-body">
              <li><strong className="text-primary-deeper">1. We read it.</strong> A principal consultant reviews your enquiry.</li>
              <li><strong className="text-primary-deeper">2. We reply.</strong> Within two business days, with questions or a time to talk.</li>
              <li><strong className="text-primary-deeper">3. We scope it together.</strong> No proposal until we both understand the problem.</li>
            </ol>
          </div>

          {!!files.length && (
            <div>
              <h2 className="font-semibold text-primary-deeper mb-3">Downloads</h2>
              <ul className="space-y-2">
                {files.map((asset) => (
                  <li key={asset.id}>
                    <a href={asset.href} download className="font-semibold text-primary-deeper underline underline-offset-4 hover:text-primary">
                      {asset.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </Section>

      <Section tone="tint">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <SectionIntro eyebrow="Before you write" title="Questions people often ask first." />
          </div>
          <div className="lg:col-span-8">
            <FAQAccordion
              items={faqList.slice(0, 5)}
              showSearch={false}
              showCategoryFilter={false}
              footerHref="/faq"
              footerLabel="See all questions"
            />
          </div>
        </div>
      </Section>
    </>
  )
}
