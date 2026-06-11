'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { faqItems as faqSeed } from '@/lib/data/faqs'
import type { FAQ } from '@/types'

interface FaqBotProps {
  items?: FAQ[]
}

export function FaqBot({ items = faqSeed as FAQ[] }: FaqBotProps) {
  const [query, setQuery] = useState('')

  const match = useMemo(() => {
    const normalized = query.toLowerCase().trim()

    if (!normalized) {
      return null
    }

    const terms = normalized.split(/\s+/).filter(Boolean)

    const bestMatch = items
      .map((item) => {
        const question = item.question.toLowerCase()
        const answer = item.answer.toLowerCase()
        const category = item.category?.toLowerCase() ?? ''
        const keywords = (item.keywords ?? []).map((keyword) => keyword.toLowerCase())

        let score = 0

        if (question.includes(normalized)) score += 10
        if (answer.includes(normalized)) score += 4
        if (category.includes(normalized)) score += 6

        for (const keyword of keywords) {
          if (normalized.includes(keyword) || keyword.includes(normalized)) {
            score += 12
          }
          if (terms.some((term) => keyword.includes(term))) {
            score += 3
          }
        }

        if (terms.some((term) => question.includes(term))) score += 2
        if (terms.some((term) => answer.includes(term))) score += 1

        return { item, score }
      })
      .sort((left, right) => right.score - left.score)[0]

    return bestMatch && bestMatch.score > 0 ? bestMatch.item : null
  }, [items, query])

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="text-xl font-bold text-slate-900">FAQ Assistant</h3>
      <p className="mt-2 text-sm text-slate-600">
        Ask a quick question, for example: &ldquo;How much is a strategy workshop?&rdquo;
      </p>

      <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="faq-query">
        Your question
      </label>
      <input
        id="faq-query"
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Type a question keyword..."
        className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />

      {query && !match && (
        <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
          <p>No exact FAQ match yet. Please submit the contact form and we will respond directly.</p>
          <Link href="/contact-us" className="mt-2 inline-block font-semibold text-primary hover:text-primary-dark">
            Go to Contact Us
          </Link>
        </div>
      )}

      {match && (
        <div className="mt-4 rounded-md bg-primary-light p-4">
          {match.category && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {match.category}
            </p>
          )}
          <p className="font-semibold text-slate-900">{match.question}</p>
          <p className="mt-2 text-sm text-slate-700">{match.answer}</p>
        </div>
      )}
    </section>
  )
}
