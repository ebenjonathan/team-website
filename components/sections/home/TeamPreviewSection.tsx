import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { TeamCard } from '@/components/cards/TeamCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { featuredTeam } from '@/lib/data/team'

export function TeamPreviewSection() {
  return (
    <section className="py-20 bg-primary-light">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="TEAM Leadership"
          title="Coaches, Catalysts & Principal Consultants"
          subtitle="The Principal Consultants who lead TEAM Consulting's advisory engagements."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {featuredTeam.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/why-team/our-team"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            Meet TEAM Leadership <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
