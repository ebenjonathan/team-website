'use client'

import { useState } from 'react'
import { PricingCard } from '@/components/cards/PricingCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { pricingPlans } from '@/lib/data/pricing'
import { cn } from '@/lib/utils'

export function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="Pricing"
          title="Transparent, Value-Driven Pricing"
          subtitle="Choose the plan that fits your business stage and goals. All plans include a 14-day free trial."
        />

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span
            className={cn(
              'text-sm font-medium',
              billing === 'monthly' ? 'text-primary-deeper' : 'text-body'
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setBilling((b) => (b === 'monthly' ? 'yearly' : 'monthly'))}
            className={cn(
              'relative w-12 h-6 rounded-full transition-colors',
              billing === 'yearly' ? 'bg-primary' : 'bg-gray-200'
            )}
            aria-label="Toggle billing period"
          >
            <span
              className={cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
                billing === 'yearly' ? 'translate-x-7' : 'translate-x-1'
              )}
            />
          </button>
          <span
            className={cn(
              'text-sm font-medium flex items-center gap-2',
              billing === 'yearly' ? 'text-primary-deeper' : 'text-body'
            )}
          >
            Yearly{' '}
            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
              Save 15%
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} billingPeriod={billing} />
          ))}
        </div>
      </div>
    </section>
  )
}
