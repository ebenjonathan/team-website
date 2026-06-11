'use client'

import type { FAQ } from '@/types'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItemProps {
  item: FAQ
  isOpen: boolean
  index: number
  onToggle: () => void
}

export function FAQItem({ item, isOpen, index, onToggle }: FAQItemProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left md:px-6"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {String(index + 1).padStart(2, '0')}
            </span>
            {item.category && (
              <span className="rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-deeper">
                {item.category}
              </span>
            )}
          </div>
          <h3 className="mt-3 text-base font-bold leading-snug text-slate-900 md:text-lg">
            {item.question}
          </h3>
        </div>

        <span
          className={cn(
            'mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-colors',
            isOpen
              ? 'border-primary bg-primary text-white'
              : 'border-slate-200 bg-slate-50 text-slate-500'
          )}
        >
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>

      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 px-5 py-5 md:px-6">
            <p className="whitespace-pre-line text-sm leading-7 text-slate-600 md:text-base">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}