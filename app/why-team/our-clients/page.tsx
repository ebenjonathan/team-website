import { Metadata } from 'next'
import {
  Landmark, Building, Factory, Flame, HeartPulse, Globe,
  ShoppingBag, Plane, GraduationCap, Cpu, Truck, HardHat,
  Wheat, Trophy, Briefcase,
} from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { companyProfile, sectors } from '@/lib/data'
import { getClientLogoGroups } from '@/lib/images'
import { ClientLogoGrid } from '@/components/ui/ClientLogoGrid'

const sectorIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Financial Services (Banking, Insurance, Microfinance, and Asset Management)': Landmark,
  'Public Sector and Local Government': Building,
  'Manufacturing (Consumer Goods and Industrial Products)': Factory,
  'Mining, Energy, Oil, and Gas': Flame,
  'Health and Pharmaceuticals': HeartPulse,
  'Development Agencies and NGOs': Globe,
  'Retail': ShoppingBag,
  'Tourism and Hospitality': Plane,
  'Education and Training': GraduationCap,
  'Information, Communications, and Technology': Cpu,
  'Automotive and Logistics': Truck,
  'Construction and Real Estate': HardHat,
  'Agriculture': Wheat,
  'Sports, Media, and Entertainment': Trophy,
  'Professional Services and Independent Representative Bodies': Briefcase,
}

export const metadata: Metadata = {
  title: 'Our Clients',
  description: 'Organisations that trust TEAM Consulting for advisory and transformation support.',
  alternates: { canonical: '/why-team/our-clients' },
}

export default async function OurClientsPage() {
  const clientGroups = getClientLogoGroups()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Clients</h1>
          <p className="text-xl text-slate-200 max-w-2xl">
            Trusted by leading organizations across industries and markets.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {companyProfile.stats.map((stat) => (
              <div key={stat.id}>
                <p className="text-4xl font-bold text-primary mb-2">{stat.display}</p>
                <p className="text-slate-600 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logo Grid */}
      {clientGroups.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <SectionHeader
              title="Featured Clients"
              subtitle="Organizations that have transformed with our partnership"
              centered
            />
            <div className="mt-14">
              <ClientLogoGrid groups={clientGroups} />
            </div>
          </div>
        </section>
      )}

      {/* Client Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">Markets Served</h2>
          <div className="mx-auto max-w-6xl">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sectors.map((sector) => {
                const Icon = sectorIcons[sector] ?? Briefcase
                return (
                  <li key={sector} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-muted flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </span>
                    <span className="text-slate-700 text-sm leading-snug pt-1">{sector}</span>
                  </li>
                )
              })}
            </ul>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Client Family?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let&apos;s explore how TEAM Consulting can drive transformation for your organization.
          </p>
          <a href="/contact-us" className="inline-block bg-white text-primary hover:bg-slate-100 font-bold py-3 px-8 rounded-lg transition-colors">
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  )
}

