import Image from 'next/image'
import { Star } from 'lucide-react'
import type { Testimonial } from '@/types'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex gap-1 mb-5">
        {Array.from({ length: testimonial.rating ?? 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <blockquote className="text-body leading-relaxed flex-1 text-base italic">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-bold text-primary-deeper text-sm">{testimonial.name}</p>
          <p className="text-xs text-primary">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  )
}
