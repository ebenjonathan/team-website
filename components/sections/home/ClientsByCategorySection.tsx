'use client'

import { SectionHeader } from '@/components/ui/SectionHeader'

interface ClientLogo {
  name: string
  logo: string
}

interface ClientCategory {
  category: string
  clients: ClientLogo[]
}

const clientLogosByCategory: ClientCategory[] = [
  {
    category: 'Banking',
    clients: [
      { name: 'BancABC', logo: '/images/clients/banking/banc-abc.png' },
      { name: 'CABS', logo: '/images/clients/banking/cabs.png' },
      { name: 'Nedbank', logo: '/images/clients/banking/nedbank.png' },
      { name: 'NMB Bank', logo: '/images/clients/banking/nmb.png' },
      { name: 'POSB', logo: '/images/clients/banking/posb.png' },
      { name: 'ZB Bank', logo: '/images/clients/banking/zb-bank.png' },
    ],
  },
  {
    category: 'Insurance',
    clients: [
      { name: 'Fidelity Life', logo: '/images/clients/insurance/fidelity-life.png' },
      { name: 'NICOZ Diamond', logo: '/images/clients/insurance/nicoz.png' },
      { name: 'Old Mutual', logo: '/images/clients/insurance/old-mutual.png' },
      { name: 'PSMAS', logo: '/images/clients/insurance/psmas.png' },
      { name: 'Sanlam', logo: '/images/clients/insurance/sanlam.png' },
      { name: 'Zimnat', logo: '/images/clients/insurance/zimnat.png' },
    ],
  },
  {
    category: 'Microfinance',
    clients: [
      { name: 'Empower Bank', logo: '/images/clients/micro-finance/empower.png' },
      { name: 'GetBucks', logo: '/images/clients/micro-finance/get-bucks.png' },
      { name: 'Zimbabwe Women\'s Microfinance Bank', logo: '/images/clients/micro-finance/zwmb.png' },
    ],
  },
  {
    category: 'Development Institutions',
    clients: [
      { name: 'ITC', logo: '/images/clients/development%20institutions/itc.png' },
      { name: 'UNDP', logo: '/images/clients/development%20institutions/undp.png' },
      { name: 'USAID', logo: '/images/clients/development%20institutions/usaid.png' },
      { name: 'WHO', logo: '/images/clients/development%20institutions/who.png' },
      { name: 'World Bank', logo: '/images/clients/development%20institutions/world-bank.png' },
    ],
  },
  {
    category: 'Industry & Energy',
    clients: [
      { name: 'Proplastics', logo: '/images/clients/other/proplastics.png' },
      { name: 'Masimba Holdings', logo: '/images/clients/other/masimba.png' },
      { name: 'Zuva Petroleum', logo: '/images/clients/other/zuva.png' },
      { name: 'Petrol Trade', logo: '/images/clients/other/petrol-trade.png' },
      { name: 'NOIC', logo: '/images/clients/other/noic.png' },
      { name: 'Pick n Pay', logo: '/images/clients/other/pnp.png' },
      { name: 'Timbers', logo: '/images/clients/other/timbers.png' },
      { name: 'Blackshark', logo: '/images/clients/other/blackshark.png' },
    ],
  },
]

function LogoScrollRow({ clients, reverse = false }: { clients: ClientLogo[]; reverse?: boolean }) {
  const tripled = [...clients, ...clients, ...clients]
  return (
    <div className="overflow-hidden">
      <div className={`logos-track flex items-center ${reverse ? 'logos-track-reverse' : ''}`}>
        {tripled.map((client, i) => (
          <div
            key={`${client.name}-${i}`}
            className="flex-shrink-0 mx-3 w-36 h-16 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center px-4 hover:shadow-md hover:border-primary/30 transition-all duration-300"
          >
            <img
              src={client.logo}
              alt={client.name}
              className="max-h-10 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
              onError={(e) => {
                const img = e.currentTarget
                img.style.display = 'none'
                const fallback = img.nextElementSibling as HTMLElement | null
                if (fallback) fallback.style.display = 'block'
              }}
            />
            <span
              className="hidden text-xs font-medium text-slate-600 text-center leading-tight"
            >
              {client.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ClientsByCategorySection() {
  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto mb-12">
        <SectionHeader
          eyebrow="Trusted By"
          title="Organisations That Trust Us"
          subtitle="Leading organisations across government, finance, manufacturing, mining, health, and development."
        />
      </div>
      <div className="space-y-8">
        {clientLogosByCategory.map(({ category, clients }, idx) => (
          <div key={category}>
            <p className="text-center text-xs text-slate-400 uppercase tracking-[0.2em] font-semibold mb-3 px-4">
              {category}
            </p>
            <LogoScrollRow clients={clients} reverse={idx % 2 === 1} />
          </div>
        ))}
      </div>
    </section>
  )
}
