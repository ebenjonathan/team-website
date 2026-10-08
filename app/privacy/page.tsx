import type { Metadata } from 'next'
import { PageHero } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Review how TEAM Consulting collects, uses, and protects your information.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy Policy" lead="This policy explains how TEAM Consulting handles personal information across our website, forms, newsletters, and client interactions." />

      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-4xl px-4 space-y-10">
          <article>
            <h2 className="font-heading text-2xl font-bold text-primary-deeper">Information We Collect</h2>
            <p className="mt-4 text-body leading-relaxed">
              We collect information you provide directly through contact, newsletter, and event registration
              forms, including your name, email address, phone number, company details, and message content.
            </p>
          </article>

          <article>
            <h2 className="font-heading text-2xl font-bold text-primary-deeper">How We Use Information</h2>
            <p className="mt-4 text-body leading-relaxed">
              We use submitted information to respond to inquiries, manage event registrations, send service
              communications, and improve our digital experiences. We do not sell personal data.
            </p>
          </article>

          <article>
            <h2 className="font-heading text-2xl font-bold text-primary-deeper">Data Retention and Security</h2>
            <p className="mt-4 text-body leading-relaxed">
              We retain data only as long as necessary for operational, legal, and service-related purposes.
              Reasonable administrative and technical safeguards are applied to reduce risk of unauthorized
              access or misuse.
            </p>
          </article>

          <article>
            <h2 className="font-heading text-2xl font-bold text-primary-deeper">Your Rights</h2>
            <p className="mt-4 text-body leading-relaxed">
              You may request access to, correction of, or deletion of your personal information by contacting
              our team. Newsletter recipients can unsubscribe at any time.
            </p>
          </article>
        </div>
      </section>
    </>
  )
}
