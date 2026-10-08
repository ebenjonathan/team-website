import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

const highlights = [
  'Founded in 2004 and rooted in Harare, Zimbabwe',
  'Associate-led model that brings specialist depth without unnecessary overhead',
  '20+ years of advisory experience and 80%+ repeat client relationships',
  'Practical support across leadership, teams, culture, wellbeing and performance',
]

export function AboutSection() {
  return (
    <section className="py-20 bg-primary-light">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <div className="relative">
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/images/about/about-8.webp"
                alt="About TEAM Consulting"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-xl overflow-hidden border-4 border-white shadow-xl hidden lg:block">
              <Image
                src="/images/about/about-square-8.webp"
                alt="Team at work"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute top-6 -right-6 bg-primary text-white rounded-xl p-4 text-center shadow-xl hidden lg:block">
              <p className="text-3xl font-bold font-heading leading-none">20+</p>
              <p className="text-xs text-white/80 uppercase tracking-wide mt-1">
                Years of
                <br />
                Advisory Experience
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <Badge variant="light" className="mb-4">
              About Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary-deeper mb-6 leading-tight">
              Helping organisations and their people{' '}
              <span className="text-primary">grow, together</span>
            </h2>
            <p className="text-body leading-relaxed mb-6">
              TEAM Consulting is a boutique advisory practice headquartered in Harare, Zimbabwe. We
              help leaders develop their people, build healthy teams and cultures, strengthen
              governance and sharpen performance.
            </p>
            <p className="text-body leading-relaxed mb-8">
              Our work is grounded in collaboration, stewardship, and practical execution. We bring
              clarity to complexity and stay close to the people who must carry the result forward.
            </p>

            <ul className="space-y-3 mb-10">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-body text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/who-we-are"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

