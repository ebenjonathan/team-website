import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

const highlights = [
  'Pan-African market expertise and deep local insights',
  'Agile delivery focused on measurable, real-world outcomes',
  'Senior consultants with 15+ years of cross-industry experience',
  'End-to-end execution from strategy through to deployment',
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
              <p className="text-3xl font-bold font-heading leading-none">15+</p>
              <p className="text-xs text-white/80 uppercase tracking-wide mt-1">
                Years of
                <br />
                Excellence
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <Badge variant="light" className="mb-4">
              About Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary-deeper mb-6 leading-tight">
              Your Strategic Partner for{' '}
              <span className="text-primary">Sustainable Growth</span>
            </h2>
            <p className="text-body leading-relaxed mb-6">
              TEAM Consulting is a premier business consultancy and digital solutions firm. We work
              at the intersection of strategy, technology, and design to help organisations navigate
              complexity and unlock their full potential.
            </p>
            <p className="text-body leading-relaxed mb-8">
              From early-stage startups to established enterprises, we bring clarity, expertise,
              and execution capability to every engagement - delivering solutions that are as
              practical as they are transformative.
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

