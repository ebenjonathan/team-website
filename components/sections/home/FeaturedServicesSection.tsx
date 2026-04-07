import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { featuredServices } from '@/lib/data/services'

export function FeaturedServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="What We Do"
          title="Comprehensive Solutions for Modern Business"
          subtitle="From strategy to execution, we deliver end-to-end services that transform how you operate and compete."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} variant="featured" />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/service-offerings"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            View all services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
