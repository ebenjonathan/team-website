import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { CaseStudy } from '@/types'

interface CaseStudyCardProps {
  caseStudy: CaseStudy
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={caseStudy.image}
          alt={caseStudy.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="primary">{caseStudy.category}</Badge>
        </div>
      </div>
      <div className="p-6">
        <p className="text-xs text-body uppercase tracking-wide mb-2">{caseStudy.client}</p>
        <h3 className="font-bold font-heading text-primary-deeper text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {caseStudy.title}
        </h3>
        <p className="text-body text-sm leading-relaxed mb-4 line-clamp-2">{caseStudy.summary}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {caseStudy.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-primary-light text-primary rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={`/ideas-at-work/${caseStudy.slug}`}
          className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
        >
          View Case Study <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
