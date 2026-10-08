'use client'

import type { FAQ } from '@/types'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItemProps {
  item: FAQ
  isOpen: boolean
  index: number
  onToggle: () => void
}

export function FAQItem({ item, isOpen, onToggle }: FAQItemProps) {
  const panelId = `faq-panel-${item.id}`
  return (
    <article className="border-b border-gray-300">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-start justify-between gap-6 py-5 text-left group"
        >
          <span className="font-heading text-lg font-bold leading-snug text-primary-deeper group-hover:text-primary">
            {item.question}
          </span>
          <Plus
            aria-hidden
            className={cn('mt-1 h-5 w-5 flex-shrink-0 text-primary transition-transform duration-200', isOpen && 'rotate-45')}
          />
        </button>
      </h3>
      <div
        id={panelId}
        className={cn('grid transition-all duration-300 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
      >
        <div className="overflow-hidden">
          <p className="whitespace-pre-line pb-6 pr-10 leading-relaxed text-body max-w-[70ch]">{item.answer}</p>
        </div>
      </div>
    </article>
  )
}
