import type { Metadata } from 'next'
import Image from 'next/image'
import { clientHallOfFame, footprintCountries, sectors } from '@/lib/data'
import { getClients } from '@/lib/sanity/content'

const countryFlagCodes: Record<string, string> = {
  Zimbabwe: 'zw',
  Zambia: 'zm',
  Namibia: 'na',
  Botswana: 'bw',
  Mozambique: 'mz',
  Uganda: 'ug',
  Tanzania: 'tz',
  Malawi: 'mw',
  'South Africa': 'za',
  Lesotho: 'ls',
}

export const metadata: Metadata = {
  title: 'Our Markets & Clients',
  description:
    'Sectors served, geographic footprint, and TEAM Consulting client hall of fame across Sub-Saharan Africa.',
}

export default async function OurMarketsClientsPage() {
  const clientsData = await getClients()

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-primary-deeper py-20 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold">Our Markets & Clients</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            TEAM has supported private, public, and development organisations across Sub-Saharan Africa
            since 2004, with repeat engagements across multiple sectors.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900">Markets & Sectors Served</h2>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {sectors.map((sector) => (
            <li key={sector} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700">
              {sector}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900">Geographic Footprint</h2>
          <div className="mt-6 flex flex-wrap gap-4">
            {footprintCountries.map((country) => {
              const code = countryFlagCodes[country]
              return (
                <div
                  key={country}
                  className="flex items-center justify-center rounded-full bg-white px-3 py-2 shadow-sm border border-slate-100"
                  title={country}
                  aria-label={country}
                >
                  {code && (
                    <Image
                      src={`https://flagcdn.com/w40/${code}.png`}
                      alt={`${country} flag`}
                      width={28}
                      height={20}
                      className="rounded-sm flex-shrink-0"
                      unoptimized
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900">Client Hall of Fame</h2>
        <p className="mt-3 text-slate-600">
          Since inception, TEAM has delivered successful assignments across government, financial services,
          manufacturing, mining, energy, health, and development agencies.
        </p>

        {/* Live Client Dataset (commented out by request)
        {!!clientsData.length && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Live Client Dataset</p>
            <p className="mt-2 text-slate-700">{clientsData.length} client records loaded from CMS/fallback adapter.</p>
          </div>
        )}
        */}

        <div className="mt-8 space-y-8">
          {Object.entries(clientHallOfFame).map(([category, names]) => (
            <section key={category} className="rounded-xl border border-slate-200 p-6">
              <h3 className="text-2xl font-semibold text-slate-900">{category}</h3>
              <ul className="mt-4 grid gap-2 md:grid-cols-2">
                {names.map((name) => (
                  <li key={name} className="text-slate-700">
                    - {name}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
