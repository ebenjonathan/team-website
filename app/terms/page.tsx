import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms governing use of the TEAM Consulting website and related services.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-primary-deeper py-20 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold">Terms of Service</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            These terms govern access to and use of the TEAM Consulting website, content, and digital services.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 space-y-10">
          <article>
            <h2 className="text-2xl font-bold text-slate-900">Use of Website</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              You agree to use this website only for lawful purposes and in a way that does not interfere with
              its security, availability, or functionality.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-slate-900">Intellectual Property</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Unless otherwise stated, website content, branding, interface components, and published materials
              are owned by or licensed to TEAM Consulting and may not be reused without permission.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-slate-900">Service Information</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Information on this website is provided for general guidance. Project scopes, pricing, and delivery
              terms are defined separately in formal proposals or signed agreements.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold text-slate-900">Limitation of Liability</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              TEAM Consulting is not liable for indirect or consequential loss arising from website use, subject
              to applicable law and any written contractual commitments.
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}
