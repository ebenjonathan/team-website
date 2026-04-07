import Link from 'next/link'
import {
  Monitor,
  Palette,
  TrendingUp,
  Smartphone,
  Shield,
  Briefcase,
  ArrowRight,
} from 'lucide-react'
import type { Service } from '@/types'

type IconComponent = React.ComponentType<{ className?: string }>

const iconMap: Record<string, IconComponent> = {
  Monitor,
  Palette,
  TrendingUp,
  Smartphone,
  Shield,
  Briefcase,
}

interface ServiceCardProps {
  service: Service
  variant?: 'featured' | 'full'
}

export function ServiceCard({ service, variant = 'full' }: ServiceCardProps) {
  const Icon = iconMap[service.icon] ?? Briefcase

  if (variant === 'featured') {
    return (
      <div className="group p-6 rounded-xl border border-gray-100 bg-white hover:border-primary hover:shadow-lg transition-all duration-300">
        <div className="w-12 h-12 rounded-lg bg-primary-muted flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
          <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
        </div>
        <h3 className="text-lg font-bold font-heading text-primary-deeper mb-2">{service.title}</h3>
        <p className="text-body text-sm leading-relaxed">{service.description}</p>
        <Link
          href={`/service-offerings/${service.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all"
        >
          Learn more <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="group p-8 rounded-xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300">
      <div className="w-14 h-14 rounded-xl bg-primary-muted flex items-center justify-center mb-6">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl font-bold font-heading text-primary-deeper mb-3">{service.title}</h3>
      <p className="text-body leading-relaxed mb-6">{service.description}</p>
      <ul className="space-y-2 mb-6">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-body">
            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={`/service-offerings/${service.slug}`}
        className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
      >
        View Details <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
