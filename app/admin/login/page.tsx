'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const json = await res.json()

      if (res.ok && json.success) {
        const from = new URLSearchParams(window.location.search).get('from') ?? '/admin'
        router.push(from)
        router.refresh()
      } else {
        setError(json.message ?? 'Invalid credentials. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-deeper px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/images/logo.png" alt="TEAM Consulting" width={56} height={56} className="rounded-xl" />
          <p className="font-heading text-xl font-bold text-white">TEAM Consulting</p>
          <p className="text-sm text-white/50">Admin Control Room</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
        >
          <h1 className="mb-6 font-heading text-2xl font-bold text-white">Sign in</h1>

          {error && (
            <div className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="admin@team.co.zw"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="********"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
              {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/30">
          Access restricted to authorised administrators only.
        </p>
      </div>
    </div>
  )
}

