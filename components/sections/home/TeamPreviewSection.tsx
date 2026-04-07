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
          eyebrow="Our People"
          title="The Minds Behind the Work"
          subtitle="A multidisciplinary team of strategists, designers, engineers, and marketers united by a passion for impact."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTeam.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/why-team/our-team"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            Meet the full team <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
