import { Metadata } from 'next'
import Image from 'next/image'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { clientHallOfFame, clients, sectors } from '@/lib/data'
import { getClients } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'Our Clients',
  description: 'Organizations that trust Team Advisory for their digital transformation.',
}

export default async function OurClientsPage() {
  const clientsData = await getClients()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
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
            <div>
              <p className="text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-slate-600 text-lg">Satisfied Clients</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">200+</p>
              <p className="text-slate-600 text-lg">Successful Projects</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">$500M+</p>
              <p className="text-slate-600 text-lg">Business Value Created</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">15+</p>
              <p className="text-slate-600 text-lg">Industries Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Featured Clients"
            subtitle="Organizations that have transformed with our partnership"
            centered
          />

          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {clientsData.map((client) => (
              <a
                key={client.id}
                href={client.website ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-8 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center h-32 hover:bg-primary-light"
              >
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={160}
                  height={64}
                  className="max-w-full max-h-full object-contain"
                  title={client.name}
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Client Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">Markets Served</h2>
          <div className="mx-auto max-w-5xl">
            <ul className="grid gap-3 md:grid-cols-2">
              {sectors.map((sector) => (
                <li key={sector} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
                  {sector}
                </li>
              ))}
            </ul>
          </div>

          <h2 className="text-4xl font-bold text-slate-900 mt-16 mb-8 text-center">Client Hall of Fame</h2>
          <div className="space-y-6">
            {Object.entries(clientHallOfFame).map(([category, names]) => (
              <article key={category} className="rounded-lg border border-slate-200 p-6">
                <h3 className="text-2xl font-semibold text-slate-900">{category}</h3>
                <ul className="mt-4 grid gap-2 md:grid-cols-2">
                  {names.map((name) => (
                    <li key={name} className="text-slate-700">- {name}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Client Family?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let&apos;s explore how Team Advisory can drive transformation for your organization.
          </p>
          <button className="bg-white text-primary hover:bg-slate-100 font-bold py-3 px-8 rounded-lg transition-colors">
            Get in Touch
          </button>
        </div>
      </section>
    </div>
  )
}
