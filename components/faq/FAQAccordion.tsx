'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { FAQ, FAQCategory } from '@/types'
import { faqCategories } from '@/lib/data/faqs'
import { cn } from '@/lib/utils'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FAQItem } from './FAQItem'
import { FAQSearchBar } from './FAQSearchBar'

interface FAQAccordionProps {
  items: FAQ[]
  eyebrow?: string
  title: string
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
  emptyCtaHref = '/contact-us',
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
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />

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
        <div className="space-y-4">
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
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <h3 className="text-lg font-bold text-slate-900">No matching FAQ found</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Try a different keyword or speak with the TEAM Consulting team directly.
          </p>
          <Link
            href={emptyCtaHref}
            className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            {emptyCtaLabel}
          </Link>
        </div>
      )}

      {footerHref && footerLabel && (
        <div className="text-center">
          <Link
            href={footerHref}
            className="inline-flex rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            {footerLabel}
          </Link>
        </div>
      )}
    </div>
  )
}
