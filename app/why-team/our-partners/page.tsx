import { Metadata } from 'next'
import { getPartners } from '@/lib/sanity/content'
import { getPartnerLogos } from '@/lib/images'
import { PartnerLogoGrid } from '@/components/ui/PartnerLogoGrid'
import { PartnerLogoImg } from '@/components/ui/PartnerLogoImg'

export const metadata: Metadata = {
  title: 'TEAM Partners',
  description: 'Strategic partner profiles for TEAM Consulting.',
  alternates: { canonical: '/why-team/our-partners' },
}

export default async function OurPartnersPage() {
  const [partners, logos] = await Promise.all([getPartners(), Promise.resolve(getPartnerLogos())])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">TEAM Partners</h1>
          <p className="text-xl text-slate-200 max-w-2xl">
            Strategic partnerships with leading technology and consulting firms.
          </p>
        </div>
      </section>

      {/* Partner Logo Grid — hidden until logos are ready */}
      {/* {logos.length > 0 && (
        <section className="py-14 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-4">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">
              Our Partners
            </p>
            <PartnerLogoGrid logos={logos} />
          </div>
        </section>
      )} */}

      {/* Partner Profiles */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">
            Strategic Partners
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            In line with our philosophy that we are greater than me, TEAM partners with specialist
            firms to extend client value.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {partners.map((partner) => (
              <a
                key={partner.id}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-shadow hover:bg-primary-light cursor-pointer"
              >
                <div className="mb-4 h-16 bg-white rounded flex items-center justify-center px-4">
                  <PartnerLogoImg src={partner.logo} alt={partner.name} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{partner.name}</h3>
                <p className="text-slate-600 text-sm">{partner.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Interested in Partnering?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            We&apos;re always open to strategic partnerships that create mutual value.
          </p>
          <a
            href="/contact-us#get-in-touch"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Learn More About Partnerships
          </a>
        </div>
      </section>
    </div>
  )
}
