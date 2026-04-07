import Image from 'next/image'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { clients } from '@/lib/data/clients'

export function ClientsSection() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="Trusted By"
          title="Organisations That Trust Us"
          subtitle="We are proud to partner with leading companies across Africa and beyond."
        />
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {clients.map((client) => (
            <div
              key={client.id}
              className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={client.logo}
                alt={client.name}
                width={120}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
