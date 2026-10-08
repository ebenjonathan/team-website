import { Metadata } from 'next'
import { getPartners } from '@/lib/sanity/content'
import { PartnerLogoImg } from '@/components/ui/PartnerLogoImg'
import { PageHero, Section, EnquiryBand } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'TEAM Partners',
  description: 'Strategic partner profiles for TEAM Consulting.',
  alternates: { canonical: '/why-team/our-partners' },
}

export default async function OurPartnersPage() {
  const partners = await getPartners()

  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Specialist partners who extend what we can offer you."
        lead="In line with our philosophy that we are greater than me, we work alongside specialist firms so clients get the right expertise for each part of the job."
      />
      <Section>
        <ul className="border-t border-gray-300">
          {partners.map((p) => (
            <li key={p.id} className="grid md:grid-cols-12 gap-6 py-8 border-b border-gray-300 items-center">
              <div className="md:col-span-3 h-14 flex items-center">
                <PartnerLogoImg src={p.logo} alt={p.name} />
              </div>
              <div className="md:col-span-7">
                <h2 className="font-heading font-bold text-xl text-primary-deeper">{p.name}</h2>
                <p className="mt-2 text-body leading-relaxed">{p.description}</p>
              </div>
              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:col-span-2 md:text-right font-semibold text-primary-deeper hover:text-primary"
                >
                  Visit website <span aria-hidden className="text-primary">→</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </Section>
      <EnquiryBand
        title="Interested in partnering with us?"
        body="We are open to partnerships that create real value for clients. Tell us what you do and where you see the fit."
        topic="partnership"
        buttonLabel="Talk to us about partnering"
      />
    </>
  )
}
