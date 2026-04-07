'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CaseStudyCard } from '@/components/cards/CaseStudyCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { caseStudies, portfolioCategories } from '@/lib/data/portfolio'
import { cn } from '@/lib/utils'

export function PortfolioPreviewSection() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered =
    activeFilter === 'All'
      ? caseStudies.slice(0, 6)
      : caseStudies.filter((c) => c.category === activeFilter).slice(0, 6)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="Ideas at Work"
          title="Our Work Speaks For Itself"
          subtitle="A selection of projects where strategy met execution and delivered measurable results."
        />

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {portfolioCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-semibold transition-all',
                activeFilter === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-primary-light text-primary hover:bg-primary hover:text-white'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((caseStudy) => (
            <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/ideas-at-work"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            View All Work <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
