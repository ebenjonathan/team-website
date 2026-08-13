import { Metadata } from 'next'
import Image from 'next/image'
import { Phone, Clock3 } from 'lucide-react'
import { ContactForm } from '@/components/forms/ContactForm'
import { SectionHeader } from '@/components/ui'
import { FAQAccordion } from '@/components/faq/FAQAccordion'
import { downloads } from '@/lib/data'
import { faqItems as fallbackFaqItems } from '@/lib/data/faqs'
import { getDownloadResources, getFaqItems } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact TEAM Consulting in Zimbabwe, submit inquiries, and access FAQ support.',
  alternates: { canonical: '/contact-us' },
  openGraph: {
    title: 'Contact Us | TEAM Consulting',
    description: 'Contact TEAM Consulting in Zimbabwe, submit inquiries, and access FAQ support.',
    url: '/contact-us',
  },
}

export default async function ContactUsPage() {
  const [downloadResources, faqItems] = await Promise.all([
    getDownloadResources(),
    getFaqItems(),
  ])
  const faqList = faqItems.length ? faqItems : fallbackFaqItems

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl text-slate-200 max-w-2xl">
            Ready to transform your business? Let&apos;s start a conversation.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {/* Contact Info */}
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-5">Contact Information</h2>

              <div className="space-y-4 text-slate-700">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href="tel:+263772202290" className="font-medium hover:text-primary transition-colors">
                    +263 77 220 2290
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <Image
                    src="https://flagcdn.com/w20/zw.png"
                    alt="Zimbabwe flag"
                    width={20}
                    height={14}
                    className="mt-1 rounded-sm"
                    unoptimized
                  />
                  <div>
                    <p className="font-medium text-slate-900">Harare, Zimbabwe</p>
                    <a href="mailto:ZW@teamadvisoryservices.com" className="block text-sm hover:text-primary transition-colors">
                      ZW@teamadvisoryservices.com
                    </a>
                    <a href="mailto:info@team.co.zw" className="block text-sm hover:text-primary transition-colors">
                      info@team.co.zw
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-slate-900">Business Hours</p>
                    <p className="text-sm">Monday to Friday, 08:00 - 16:30 CAT</p>
                  </div>
                </div>
              </div>
            </article>

            <article>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Business Hours</h3>
              <p className="text-slate-600 mb-2">Monday – Friday</p>
              <p className="text-slate-600 mb-6">08:00 – 16:30 CAT</p>

              <h4 className="font-bold text-slate-900 mb-2">Connect With Us</h4>
              <div className="flex gap-4">
                <a
                  href="https://zw.linkedin.com/company/teamadvisory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-primary"
                >
                  LinkedIn
                </a>
                <a
                  href="https://www.facebook.com/TEAMConsult/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-primary"
                >
                  Facebook
                </a>
              </div>
            </article>

            <article>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Downloads</h3>
              <p className="text-slate-600 mb-6">
                Access company and service assets from the master brief.
              </p>
              <ul className="space-y-3">
                {(downloadResources.length ? downloadResources : downloads).map((asset) => (
                  <li key={asset.id}>
                    <a
                      href={asset.href}
                      download
                      className="text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      {asset.label}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 my-12"></div>

          {/* Contact Form + FAQ, side by side on desktop */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div id="get-in-touch">
              <SectionHeader
                title="Send Us a Message"
                subtitle="Tell us about your project"
              />

              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            <FAQAccordion
              items={faqList.slice(0, 5)}
              eyebrow="FAQ"
              title="Frequently Asked Questions"
              subtitle="Quick answers before you reach out."
              showSearch={false}
              showCategoryFilter={false}
              footerHref="/faq"
              footerLabel="View All FAQs"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
