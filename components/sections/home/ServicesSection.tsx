import { ServiceCard } from '@/components/cards/ServiceCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { services } from '@/lib/data/services'

export function ServicesSection() {
  return (
    <section className="py-20 bg-primary-light">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="Our Services"
          title="Full-Spectrum Digital Solutions"
          subtitle="Everything you need to build, grow, and scale in the digital age — under one roof."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
