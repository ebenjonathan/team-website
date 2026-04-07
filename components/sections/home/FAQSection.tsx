'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { faqs } from '@/lib/data/pricing'
import { cn } from '@/lib/utils'

export function FAQSection() {
  const [open, setOpen] = useState<string | null>('1')

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about working with Team Advisory."
        />
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-primary-light rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-6 text-left gap-4"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xs font-bold text-primary w-6 flex-shrink-0 font-heading">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'font-semibold font-heading transition-colors text-sm md:text-base',
                      open === faq.id ? 'text-primary' : 'text-primary-deeper'
                    )}
                  >
                    {faq.question}
                  </span>
                </span>
                <span className="flex-shrink-0">
                  {open === faq.id ? (
                    <Minus className="w-5 h-5 text-primary" />
                  ) : (
                    <Plus className="w-5 h-5 text-body" />
                  )}
                </span>
              </button>
              {open === faq.id && (
                <div className="px-6 pb-6 pl-[3.25rem] text-body text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
