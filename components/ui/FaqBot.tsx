'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import faqSeed from '@/lib/data/faq-seed.json'
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

    return (
      items.find((item) =>
        (item.keywords ?? []).some((keyword) => normalized.includes(keyword.toLowerCase())),
      ) ?? null
    )
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
          <p className="font-semibold text-slate-900">{match.question}</p>
          <p className="mt-2 text-sm text-slate-700">{match.answer}</p>
        </div>
      )}
    </section>
  )
}
