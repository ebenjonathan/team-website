'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { FAQ, FAQCategory } from '@/types'
import { faqCategories } from '@/lib/data/faqs'
import { cn } from '@/lib/utils'
import { FAQItem } from './FAQItem'
import { FAQSearchBar } from './FAQSearchBar'

interface FAQAccordionProps {
  items: FAQ[]
  eyebrow?: string
  title?: string
  subtitle?: string
  showSearch?: boolean
  showCategoryFilter?: boolean
  initialOpenId?: string | null
  emptyCtaHref?: string
  emptyCtaLabel?: string
  footerHref?: string
  footerLabel?: string
  className?: string
}

export function FAQAccordion({
  items,
  eyebrow,
  title,
  subtitle,
  showSearch = true,
  showCategoryFilter = true,
  initialOpenId,
  emptyCtaHref = '/contact-us#enquiry',
  emptyCtaLabel = 'Contact Us',
  footerHref,
  footerLabel,
  className,
}: FAQAccordionProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<'All' | FAQCategory>('All')
  const [openId, setOpenId] = useState<string | null>(initialOpenId ?? items[0]?.id ?? null)

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return items.filter((item) => {
      const matchesCategory =
        !showCategoryFilter || activeCategory === 'All' || item.category === activeCategory

      if (!matchesCategory) {
        return false
      }

      if (!normalized) {
        return true
      }

      const haystack = [
        item.question,
        item.answer,
        item.category ?? '',
        ...(item.keywords ?? []),
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalized)
    })
  }, [activeCategory, items, query, showCategoryFilter])

  useEffect(() => {
    if (!filteredItems.some((item) => item.id === openId)) {
      setOpenId(filteredItems[0]?.id ?? null)
    }
  }, [filteredItems, openId])

  return (
    <div className={cn('space-y-8', className)}>
      {title && (
        <div className="max-w-3xl">
          {eyebrow && <p className="text-sm font-semibold text-primary mb-4">— {eyebrow}</p>}
          <h2 className="font-heading font-bold text-3xl md:text-[2.5rem] leading-[1.12] text-primary-deeper">{title}</h2>
          {subtitle && <p className="mt-4 text-lg text-body leading-relaxed">{subtitle}</p>}
        </div>
      )}

      {showSearch && (
        <FAQSearchBar
          query={query}
          onQueryChange={setQuery}
          categories={showCategoryFilter ? [...faqCategories] : ['All']}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          resultCount={filteredItems.length}
        />
      )}

      {filteredItems.length > 0 ? (
        <div className="border-t border-gray-300">
          {filteredItems.map((item, index) => (
            <FAQItem
              key={item.id}
              item={item}
              index={index}
              isOpen={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="border-t border-gray-300 py-10">
          <h3 className="font-heading text-xl font-bold text-primary-deeper">No questions match that search.</h3>
          <p className="mt-2 text-body leading-relaxed">
            Try a shorter word, choose another category, or ask us directly.
          </p>
          <Link
            href={emptyCtaHref}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark"
          >
            {emptyCtaLabel}
          </Link>
        </div>
      )}

      {footerHref && footerLabel && (
        <div>
          <Link
            href={footerHref}
            className="inline-flex items-baseline gap-1 font-semibold text-primary-deeper underline-offset-4 decoration-2 hover:underline hover:text-primary"
          >
            {footerLabel} <span aria-hidden className="text-primary">→</span>
          </Link>
        </div>
      )}
    </div>
  )
}
