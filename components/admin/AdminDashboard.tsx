'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BarChart2, Mail, Calendar, Send, FileText, LogOut, Trash2, Plus, User } from 'lucide-react'

//  Types 

type DiagnosticSubmission = {
  id: string
  timestamp: string
  name: string
  email: string
  businessName: string
  businessType: string
  score: number
  payload?: {
    result?: {
      category?: string
      industry?: string
      financialImpact?: { annualLoss?: number }
    }
  }
}

type ContactSubmission = {
  timestamp: string
  channel: 'contact' | 'event-registration' | 'newsletter' | 'diagnostic'
  mode: string
  payload: Record<string, unknown>
}

type BlogPost = { id: string; title: string; excerpt: string; createdAt: string }
type Subscriber = { id: string; email: string; createdAt: string }

type Tab = 'diagnostics' | 'contacts' | 'events' | 'newsletter' | 'blog'

//  CSV helper 

function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(','),
    ...rows.map((r) =>
      headers.map((h) => JSON.stringify(r[h] ?? '')).join(','),
    ),
  ].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

//  Sub-components 

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5">
      <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">{icon}</span>
      <div>
        <p className="text-2xl font-bold text-primary">{value}</p>
        <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
      </div>
    </div>
  )
}

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="search"
      placeholder="Search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
    />
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="py-12 text-center text-sm text-white/40">{message}</p>
  )
}

//  Main component 

export default function AdminDashboard() {
  const router = useRouter()

  const [diagnostics, setDiagnostics] = useState<DiagnosticSubmission[]>([])
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState<Tab>('diagnostics')
  const [search, setSearch] = useState('')

  const [newTitle, setNewTitle] = useState('')
  const [newExcerpt, setNewExcerpt] = useState('')
  const [newSubEmail, setNewSubEmail] = useState('')

  const loadAll = useCallback(async () => {
    setLoading(true)
    const [sRes, cRes, bRes, nRes] = await Promise.allSettled([
      fetch('/api/admin/submissions').then((r) => r.json()),
      fetch('/api/admin/contact-submissions').then((r) => r.json()),
      fetch('/api/admin/blog').then((r) => r.json()),
      fetch('/api/admin/subscribers').then((r) => r.json()),
    ])
    if (sRes.status === 'fulfilled') setDiagnostics(sRes.value.submissions ?? [])
    if (cRes.status === 'fulfilled') setContacts(cRes.value.submissions ?? [])
    if (bRes.status === 'fulfilled') setPosts(bRes.value.posts ?? [])
    if (nRes.status === 'fulfilled') setSubscribers(nRes.value.subscribers ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { void loadAll() }, [loadAll])

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  async function createPost() {
    if (!newTitle.trim() || !newExcerpt.trim()) return
    await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, excerpt: newExcerpt }),
    })
    setNewTitle('')
    setNewExcerpt('')
    await loadAll()
  }

  async function deletePost(id: string) {
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    await loadAll()
  }

  async function addSubscriber() {
    if (!newSubEmail.trim()) return
    await fetch('/api/admin/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newSubEmail }),
    })
    setNewSubEmail('')
    await loadAll()
  }

  async function removeSubscriber(id: string) {
    await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' })
    await loadAll()
  }

  //  Filtered data 
  const q = search.toLowerCase()

  const filteredDiagnostics = useMemo(
    () => diagnostics.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.businessName.toLowerCase().includes(q) ||
        s.businessType.toLowerCase().includes(q),
    ),
    [diagnostics, q],
  )

  const contactOnly = useMemo(
    () => contacts.filter((c) => c.channel === 'contact'),
    [contacts],
  )

  const filteredContacts = useMemo(
    () =>
      contactOnly.filter((c) => {
        const p = c.payload
        return (
          String(p.name ?? '').toLowerCase().includes(q) ||
          String(p.email ?? '').toLowerCase().includes(q) ||
          String(p.organisation ?? '').toLowerCase().includes(q)
        )
      }),
    [contactOnly, q],
  )

  const eventOnly = useMemo(
    () => contacts.filter((c) => c.channel === 'event-registration'),
    [contacts],
  )

  const filteredEvents = useMemo(
    () =>
      eventOnly.filter((c) => {
        const p = c.payload
        return (
          String(p.firstName ?? '').toLowerCase().includes(q) ||
          String(p.lastName ?? '').toLowerCase().includes(q) ||
          String(p.email ?? '').toLowerCase().includes(q) ||
          String(p.eventTitle ?? '').toLowerCase().includes(q)
        )
      }),
    [eventOnly, q],
  )

  const filteredSubscribers = useMemo(
    () => subscribers.filter((s) => s.email.toLowerCase().includes(q)),
    [subscribers, q],
  )

  const filteredPosts = useMemo(
    () => posts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q),
    ),
    [posts, q],
  )

  //  Tab config 
  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'diagnostics', label: 'Diagnostics', icon: <BarChart2 className="w-4 h-4" />, count: diagnostics.length },
    { id: 'contacts', label: 'Contact Forms', icon: <Mail className="w-4 h-4" />, count: contactOnly.length },
    { id: 'events', label: 'Event Registrations', icon: <Calendar className="w-4 h-4" />, count: eventOnly.length },
    { id: 'newsletter', label: 'Subscribers', icon: <Send className="w-4 h-4" />, count: subscribers.length },
    { id: 'blog', label: 'Blog Posts', icon: <FileText className="w-4 h-4" />, count: posts.length },
  ]

  const fmt = (ts: string) => new Date(ts).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <main
      className="min-h-screen bg-primary-deeper px-4 py-8 text-white"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      <div className="mx-auto max-w-7xl space-y-6">

        {/*  Header  */}
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <Image src="/images/TEAM-logo.png" alt="TEAM Consulting" width={365} height={406} className="h-9 w-auto" />
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">TEAM Control Room</p>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-red-400/50 hover:text-red-300"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </header>

        {/*  Stat cards  */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Diagnostics" value={diagnostics.length} icon={<BarChart2 className="w-5 h-5" />} />
          <StatCard label="Contact Forms" value={contactOnly.length} icon={<Mail className="w-5 h-5" />} />
          <StatCard label="Event Registrations" value={eventOnly.length} icon={<Calendar className="w-5 h-5" />} />
          <StatCard label="Subscribers" value={subscribers.length} icon={<Send className="w-5 h-5" />} />
        </section>

        {/*  Tabs  */}
        <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearch('') }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
              <span className={`ml-1 rounded-full px-1.5 text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/*  Tab panels  */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">

          {/* Search + Export row */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <SearchInput value={search} onChange={setSearch} />
            <div className="flex gap-2">
              {activeTab === 'diagnostics' && (
                <button
                  onClick={() =>
                    downloadCSV('diagnostics.csv', filteredDiagnostics.map((s) => ({
                      Date: s.timestamp,
                      Name: s.name,
                      Email: s.email,
                      Business: s.businessName,
                      Type: s.businessType,
                      Score: s.score,
                      Category: s.payload?.result?.category ?? '',
                      'Annual Loss': s.payload?.result?.financialImpact?.annualLoss ?? '',
                    })))}
                  className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-primary hover:text-primary"
                >
                   Export CSV
                </button>
              )}
              {activeTab === 'contacts' && (
                <button
                  onClick={() =>
                    downloadCSV('contact-forms.csv', filteredContacts.map((c) => ({
                      Date: c.timestamp,
                      Name: c.payload.name ?? '',
                      Email: c.payload.email ?? '',
                      Organisation: c.payload.organisation ?? '',
                      Country: c.payload.country ?? '',
                      'Request Type': c.payload.requestType ?? '',
                      Message: c.payload.message ?? '',
                    })))}
                  className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-primary hover:text-primary"
                >
                   Export CSV
                </button>
              )}
              {activeTab === 'events' && (
                <button
                  onClick={() =>
                    downloadCSV('event-registrations.csv', filteredEvents.map((c) => ({
                      Date: c.timestamp,
                      'First Name': c.payload.firstName ?? '',
                      'Last Name': c.payload.lastName ?? '',
                      Email: c.payload.email ?? '',
                      Event: c.payload.eventTitle ?? '',
                      Phone: c.payload.phone ?? '',
                    })))}
                  className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-primary hover:text-primary"
                >
                   Export CSV
                </button>
              )}
              {activeTab === 'newsletter' && (
                <button
                  onClick={() =>
                    downloadCSV('subscribers.csv', filteredSubscribers.map((s) => ({
                      Email: s.email,
                      'Subscribed At': s.createdAt,
                    })))}
                  className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-primary hover:text-primary"
                >
                   Export CSV
                </button>
              )}
            </div>
          </div>

          {loading && <p className="py-12 text-center text-sm text-white/40">Loading</p>}

          {/*  Diagnostics  */}
          {!loading && activeTab === 'diagnostics' && (
            filteredDiagnostics.length === 0 ? <EmptyState message="No diagnostic submissions found." /> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-widest text-white/40">
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Email</th>
                      <th className="pb-3 pr-4">Business</th>
                      <th className="pb-3 pr-4">Type</th>
                      <th className="pb-3 pr-4">Score</th>
                      <th className="pb-3 pr-4">Category</th>
                      <th className="pb-3">Est. Annual Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDiagnostics.map((s) => (
                      <tr key={s.id} className="border-t border-white/5 hover:bg-white/5">
                        <td className="py-2.5 pr-4 text-white/50">{fmt(s.timestamp)}</td>
                        <td className="py-2.5 pr-4 font-medium">{s.name}</td>
                        <td className="py-2.5 pr-4 text-white/70">{s.email}</td>
                        <td className="py-2.5 pr-4">{s.businessName}</td>
                        <td className="py-2.5 pr-4 text-white/60">{s.businessType}</td>
                        <td className="py-2.5 pr-4 font-bold text-primary">{s.score}%</td>
                        <td className="py-2.5 pr-4 text-white/70">{s.payload?.result?.category ?? ''}</td>
                        <td className="py-2.5 text-amber-300">
                          {typeof s.payload?.result?.financialImpact?.annualLoss === 'number'
                            ? `$${s.payload.result.financialImpact.annualLoss.toLocaleString()}`
                            : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/*  Contact forms  */}
          {!loading && activeTab === 'contacts' && (
            filteredContacts.length === 0 ? <EmptyState message="No contact form submissions found." /> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-widest text-white/40">
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Email</th>
                      <th className="pb-3 pr-4">Organisation</th>
                      <th className="pb-3 pr-4">Country</th>
                      <th className="pb-3">Request Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((c, i) => (
                      <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                        <td className="py-2.5 pr-4 text-white/50">{fmt(c.timestamp)}</td>
                        <td className="py-2.5 pr-4 font-medium">{String(c.payload.name ?? '')}</td>
                        <td className="py-2.5 pr-4 text-white/70">{String(c.payload.email ?? '')}</td>
                        <td className="py-2.5 pr-4 text-white/60">{String(c.payload.organisation ?? '')}</td>
                        <td className="py-2.5 pr-4 text-white/60">{String(c.payload.country ?? '')}</td>
                        <td className="py-2.5 text-primary">{String(c.payload.requestType ?? '')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/*  Event registrations  */}
          {!loading && activeTab === 'events' && (
            filteredEvents.length === 0 ? <EmptyState message="No event registrations found." /> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-widest text-white/40">
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Email</th>
                      <th className="pb-3 pr-4">Phone</th>
                      <th className="pb-3">Event</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((c, i) => (
                      <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                        <td className="py-2.5 pr-4 text-white/50">{fmt(c.timestamp)}</td>
                        <td className="py-2.5 pr-4 font-medium">{String(c.payload.firstName ?? '')} {String(c.payload.lastName ?? '')}</td>
                        <td className="py-2.5 pr-4 text-white/70">{String(c.payload.email ?? '')}</td>
                        <td className="py-2.5 pr-4 text-white/60">{String(c.payload.phone ?? '')}</td>
                        <td className="py-2.5 text-primary">{String(c.payload.eventTitle ?? '')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/*  Newsletter subscribers  */}
          {!loading && activeTab === 'newsletter' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none"
                  placeholder="name@company.com"
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSubscriber()}
                />
                <button
                  onClick={addSubscriber}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  <Plus className="w-4 h-4 inline mr-1" />Add
                </button>
              </div>

              {filteredSubscribers.length === 0 ? <EmptyState message="No subscribers found." /> : (
                <ul className="space-y-2">
                  {filteredSubscribers.map((sub) => (
                    <li
                      key={sub.id}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm"
                    >
                      <span className="inline-flex items-center gap-2"><User className="w-3.5 h-3.5 text-white/40" /> {sub.email}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-white/40">{fmt(sub.createdAt)}</span>
                        <button
                          onClick={() => removeSubscriber(sub.id)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline mr-1" />Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/*  Blog posts  */}
          {!loading && activeTab === 'blog' && (
            <div className="space-y-5">
              <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white/80">New Post</h3>
                <input
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none"
                  placeholder="Post title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <textarea
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none"
                  placeholder="Post excerpt"
                  rows={3}
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                />
                <button
                  onClick={createPost}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  <Plus className="w-4 h-4 inline mr-1" />Add Post
                </button>
              </div>

              {filteredPosts.length === 0 ? <EmptyState message="No blog posts found." /> : (
                <div className="space-y-3">
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <div>
                        <h4 className="font-semibold">{post.title}</h4>
                        <p className="mt-1 text-sm text-white/60">{post.excerpt}</p>
                        <p className="mt-2 text-xs text-white/30">{fmt(post.createdAt)}</p>
                      </div>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="shrink-0 text-xs text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline mr-1" />Delete
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}


