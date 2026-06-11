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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <label className="block text-sm font-semibold text-slate-900" htmlFor="faq-search">
        Search the knowledge base
      </label>
      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by question, keyword, service, or outcome"
          className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors',
              activeCategory === category
                ? 'border-primary bg-primary text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {resultCount} result{resultCount === 1 ? '' : 's'} found.
      </p>
    </div>
  )
}