import { Check } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { PricingPlan } from '@/types'

interface PricingCardProps {
  plan: PricingPlan
  billingPeriod: 'monthly' | 'yearly'
}

export function PricingCard({ plan, billingPeriod }: PricingCardProps) {
  const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice

  return (
    <div
      className={cn(
        'relative rounded-2xl p-8 transition-all',
        plan.isFeatured
          ? 'bg-primary text-white shadow-2xl scale-105'
          : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
      )}
    >
      {plan.isFeatured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-deeper text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide whitespace-nowrap">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3
          className={cn(
            'text-xl font-bold font-heading',
            plan.isFeatured ? 'text-white' : 'text-primary-deeper'
          )}
        >
          {plan.name}
        </h3>
        <p className={cn('text-sm mt-1', plan.isFeatured ? 'text-white/70' : 'text-body')}>
          {plan.description}
        </p>
      </div>

      <div className="mb-6">
        <span
          className={cn(
            'text-5xl font-bold font-heading',
            plan.isFeatured ? 'text-white' : 'text-primary-deeper'
          )}
        >
          ${price}
        </span>
        <span className={cn('text-sm ml-1', plan.isFeatured ? 'text-white/70' : 'text-body')}>
          /mo
        </span>
        {billingPeriod === 'yearly' && (
          <p className={cn('text-xs mt-1', plan.isFeatured ? 'text-white/60' : 'text-primary')}>
            Billed annually
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className={cn(
              'flex items-center gap-3 text-sm',
              plan.isFeatured ? 'text-white/80' : 'text-body'
            )}
          >
            <Check
              className={cn(
                'w-4 h-4 flex-shrink-0',
                plan.isFeatured ? 'text-white' : 'text-primary'
              )}
            />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/contact-us"
        className={cn(
          'block w-full text-center py-3 px-6 rounded-lg font-semibold text-base transition-colors',
          plan.isFeatured
            ? 'bg-white text-primary hover:bg-primary-light'
            : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
        )}
      >
        {plan.ctaLabel}
      </Link>
    </div>
  )
}
