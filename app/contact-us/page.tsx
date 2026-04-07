import { Metadata } from 'next'
import { ContactForm } from '@/components/forms/ContactForm'
import { FaqBot, SectionHeader } from '@/components/ui'
import { contacts, downloads } from '@/lib/data'
import faqSeed from '@/lib/data/faq-seed.json'
import { getCountryContacts, getDownloadResources, getFaqItems } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact TEAM Consulting in Zimbabwe or Zambia, submit inquiries, and access FAQ support.',
}

export default async function ContactUsPage() {
  const [countryContacts, downloadResources, faqItems] = await Promise.all([
    getCountryContacts(),
    getDownloadResources(),
    getFaqItems(),
  ])

  const zw = Array.isArray(countryContacts)
    ? countryContacts.find((item: any) => item.country === 'Zimbabwe')
    : null
  const zm = Array.isArray(countryContacts)
    ? countryContacts.find((item: any) => item.country === 'Zambia')
    : null

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
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
            <article>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Country Offices</h2>
              <p className="text-slate-600 mb-2">📍 {zw?.address ?? contacts.headquarters}</p>
              <p className="text-slate-600 mb-2">📞 {zw?.phone ?? contacts.phone}</p>
              <p className="text-slate-600 mb-2">✉️ {contacts.generalEmail}</p>
              <p className="text-slate-600 mb-2">🇿🇼 Zimbabwe: {zw?.email ?? contacts.zimbabweEmail}</p>
              <p className="text-slate-600">🇿🇲 Zambia: {zm?.email ?? contacts.zambiaEmail}</p>
            </article>

            <article>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Business Hours</h3>
              <p className="text-slate-600 mb-2">Monday - Friday</p>
              <p className="text-slate-600 mb-6">09:00 AM - 6:00 PM SAST</p>

              <h4 className="font-bold text-slate-900 mb-2">Connect With Us</h4>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com" className="text-slate-600 hover:text-primary">
                  LinkedIn
                </a>
                <a href="https://x.com" className="text-slate-600 hover:text-primary">
                  Twitter
                </a>
                <a href="https://www.facebook.com" className="text-slate-600 hover:text-primary">
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

          {/* Contact Form */}
          <div className="max-w-2xl">
            <SectionHeader
              title="Send Us a Message"
              subtitle="Tell us about your project"
            />

            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            <FaqBot items={faqItems.length ? faqItems : faqSeed} />

            <div className="space-y-4">
              {(faqItems.length ? faqItems : faqSeed).map((item) => (
                <article key={item.id} className="rounded-lg bg-white p-6">
                  <h3 className="font-bold text-slate-900">{item.question}</h3>
                  <p className="mt-2 text-slate-600">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
