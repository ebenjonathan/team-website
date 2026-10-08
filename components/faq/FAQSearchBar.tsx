'use client'

import type { FAQCategory } from '@/types'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQSearchBarProps {
  query: string
  onQueryChange: (value: string) => void
  categories: Array<'All' | FAQCategory>
  activeCategory: 'All' | FAQCategory
  onCategoryChange: (value: 'All' | FAQCategory) => void
  resultCount: number
}

export function FAQSearchBar({
  query,
  onQueryChange,
  categories,
  activeCategory,
  onCategoryChange,
  resultCount,
}: FAQSearchBarProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-primary-deeper" htmlFor="faq-search">
        Search the questions
      </label>
      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="For example: fees, governance, how long"
          className="w-full rounded-md border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-primary-deeper outline-none focus:border-primary focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            aria-pressed={activeCategory === category}
            className={cn(
              'rounded-md border px-3.5 py-2 text-sm font-semibold transition-colors',
              activeCategory === category
                ? 'border-primary-deeper bg-primary-deeper text-white'
                : 'border-gray-300 bg-white text-primary-deeper hover:border-primary hover:text-primary'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-body/70" aria-live="polite">
        {resultCount} result{resultCount === 1 ? '' : 's'} found.
      </p>
    </div>
  )
}