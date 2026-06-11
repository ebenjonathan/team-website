import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Review how TEAM Consulting collects, uses, and protects your information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-primary-deeper py-20 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold">Privacy Policy</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            This policy explains how TEAM Consulting handles personal information across our website,
            forms, newsletters, and client interactions.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 space-y-10">
          <article>
            <h2 className="text-2xl font-bold text-slate-900">Information We Collect</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              We collect information you provide directly through contact, newsletter, and event registration
              forms, including your name, email address, phone number, company details, and message content.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-slate-900">How We Use Information</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              We use submitted information to respond to inquiries, manage event registrations, send service
              communications, and improve our digital experiences. We do not sell personal data.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-slate-900">Data Retention and Security</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              We retain data only as long as necessary for operational, legal, and service-related purposes.
              Reasonable administrative and technical safeguards are applied to reduce risk of unauthorized
              access or misuse.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-slate-900">Your Rights</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              You may request access to, correction of, or deletion of your personal information by contacting
              our team. Newsletter recipients can unsubscribe at any time.
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}
