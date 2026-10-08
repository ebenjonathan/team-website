'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react'
import type { Associate } from '@/lib/data/associates'

type Storage = { mode: 'sanity' | 'file'; persistent: boolean; message: string }

type Draft = {
  name: string
  role: string
  bio: string
  photo: string
  photoAssetId: string
  focusAreas: string
  sectors: string
  qualifications: string
  yearsConsulting: string
  overallExperience: string
  linkedin: string
  published: boolean
  order: string
}

const empty: Draft = {
  name: '', role: '', bio: '', photo: '', photoAssetId: '', focusAreas: '', sectors: '',
  qualifications: '', yearsConsulting: '', overallExperience: '', linkedin: '', published: false, order: '100',
}

const toDraft = (a: Associate): Draft => ({
  name: a.name,
  role: a.role,
  bio: a.bio ?? '',
  photo: a.photo ?? '',
  photoAssetId: a.photoAssetId ?? '',
  focusAreas: a.focusAreas.join(', '),
  sectors: a.sectors.join(', '),
  qualifications: a.qualifications.join('\n'),
  yearsConsulting: a.yearsConsulting?.toString() ?? '',
  overallExperience: a.overallExperience?.toString() ?? '',
  linkedin: a.linkedin ?? '',
  published: a.published,
  order: a.order.toString(),
})

const splitComma = (v: string) => v.split(',').map((s) => s.trim()).filter(Boolean)
const splitLines = (v: string) => v.split('\n').map((s) => s.trim()).filter(Boolean)
const num = (v: string) => (v.trim() === '' ? null : Number(v))

function toPayload(d: Draft) {
  return {
    name: d.name,
    role: d.role,
    bio: d.bio,
    photo: d.photo,
    photoAssetId: d.photoAssetId,
    focusAreas: splitComma(d.focusAreas),
    sectors: splitComma(d.sectors),
    qualifications: splitLines(d.qualifications),
    yearsConsulting: num(d.yearsConsulting),
    overallExperience: num(d.overallExperience),
    linkedin: d.linkedin,
    published: d.published,
    order: Number(d.order) || 100,
  }
}

const input =
  'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
const label = 'block text-xs font-semibold text-white/70 mb-1'

export default function AssociatesManager() {
  const [items, setItems] = useState<Associate[]>([])
  const [storage, setStorage] = useState<Storage | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<{ id: string | null; draft: Draft } | null>(null)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/associates', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setItems(data.associates)
      setStorage(data.storage)
    } catch (e) {
      setNotice({ kind: 'error', text: e instanceof Error && e.message ? e.message : 'Could not load associates.' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const flash = (kind: 'ok' | 'error', text: string) => {
    setNotice({ kind, text })
    if (kind === 'ok') setTimeout(() => setNotice(null), 4000)
  }

  async function save(d: Draft, id: string | null) {
    setBusy(true)
    setErrors({})
    try {
      const res = await fetch(id ? `/api/admin/associates/${encodeURIComponent(id)}` : '/api/admin/associates', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload(d)),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.errors) setErrors(data.errors)
        throw new Error(data.message ?? 'Check the highlighted fields.')
      }
      flash('ok', `${d.name} saved${d.published ? ' and shown on the website' : ' as a draft (not on the website)'}.`)
      setEditing(null)
      await load()
    } catch (e) {
      flash('error', e instanceof Error ? e.message : 'Could not save.')
    } finally {
      setBusy(false)
    }
  }

  async function togglePublished(a: Associate) {
    await save({ ...toDraft(a), published: !a.published }, a.id)
  }

  async function remove(a: Associate) {
    if (!window.confirm(`Delete ${a.name}? This removes them from the website and cannot be undone.`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/associates/${encodeURIComponent(a.id)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message ?? 'Could not delete.')
      flash('ok', `${a.name} deleted.`)
      await load()
    } catch (e) {
      flash('error', e instanceof Error ? e.message : 'Could not delete.')
    } finally {
      setBusy(false)
    }
  }

  async function uploadPhoto(file: File) {
    if (!editing) return
    setBusy(true)
    try {
      const body = new FormData()
      body.append('photo', file)
      const res = await fetch('/api/admin/associates/photo', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Upload failed.')
      setEditing({ ...editing, draft: { ...editing.draft, photo: data.url, photoAssetId: data.assetId ?? '' } })
    } catch (e) {
      flash('error', e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const set = (k: keyof Draft, v: string | boolean) =>
    editing && setEditing({ ...editing, draft: { ...editing.draft, [k]: v } })
  const err = (k: string) => errors[k]?.[0]

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Associate consultants</h2>
          <p className="text-sm text-white/60 max-w-xl">
            Associates ticked “Show on website” appear on the Leadership page, in the order you set. Drafts stay hidden.
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => { setErrors({}); setEditing({ id: null, draft: empty }) }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4" /> Add associate
          </button>
        )}
      </div>

      {storage && !storage.persistent && (
        <div className="flex gap-3 rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-100">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> <p>{storage.message}</p>
        </div>
      )}

      {notice && (
        <div
          role={notice.kind === 'error' ? 'alert' : 'status'}
          className={`flex gap-2 rounded-lg p-3 text-sm ${notice.kind === 'error' ? 'bg-red-500/15 text-red-200 border border-red-400/40' : 'bg-primary/20 text-white border border-primary/40'}`}
        >
          {notice.kind === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
          <p>{notice.text}</p>
        </div>
      )}

      {editing && (
        <form
          onSubmit={(e) => { e.preventDefault(); save(editing.draft, editing.id) }}
          className="rounded-xl border border-white/15 bg-white/5 p-5 space-y-4"
        >
          <h3 className="font-semibold">{editing.id ? `Edit ${editing.draft.name || 'associate'}` : 'New associate'}</h3>

          <div className="flex items-center gap-4">
            <div className="h-24 w-20 overflow-hidden rounded-md bg-white/10 flex items-center justify-center text-xs text-white/40">
              {editing.draft.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editing.draft.photo} alt="" className="h-full w-full object-cover object-top" />
              ) : (
                'No photo'
              )}
            </div>
            <div className="space-y-2">
              <input ref={fileRef} id="assoc-photo" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only"
                onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
              <label htmlFor="assoc-photo" className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:border-primary">
                <Upload className="w-4 h-4" /> {editing.draft.photo ? 'Replace photo' : 'Upload photo'}
              </label>
              {editing.draft.photo && (
                <button type="button" onClick={() => setEditing({ ...editing, draft: { ...editing.draft, photo: '', photoAssetId: '' } })}
                  className="block text-xs text-white/60 hover:text-red-300">Remove photo</button>
              )}
              <p className="text-xs text-white/40">JPG, PNG or WebP, under 3 MB. A portrait crop works best.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="a-name" className={label}>Full name</label>
              <input id="a-name" className={input} value={editing.draft.name} onChange={(e) => set('name', e.target.value)} required />
              {err('name') && <p className="mt-1 text-xs text-red-300">{err('name')}</p>}
            </div>
            <div>
              <label htmlFor="a-role" className={label}>Role or title</label>
              <input id="a-role" className={input} placeholder="e.g. Associate Consultant (Governance)" value={editing.draft.role} onChange={(e) => set('role', e.target.value)} required />
              {err('role') && <p className="mt-1 text-xs text-red-300">{err('role')}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="a-bio" className={label}>Short biography</label>
            <textarea id="a-bio" rows={4} className={input} value={editing.draft.bio} onChange={(e) => set('bio', e.target.value)}
              placeholder="Two or three sentences on their experience and what they bring to clients." />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="a-focus" className={label}>Focus areas (separate with commas)</label>
              <input id="a-focus" className={input} value={editing.draft.focusAreas} onChange={(e) => set('focusAreas', e.target.value)} placeholder="Strategy, Coaching, Governance" />
            </div>
            <div>
              <label htmlFor="a-sectors" className={label}>Key sectors (separate with commas)</label>
              <input id="a-sectors" className={input} value={editing.draft.sectors} onChange={(e) => set('sectors', e.target.value)} placeholder="Public sector, Financial services" />
            </div>
          </div>

          <div>
            <label htmlFor="a-quals" className={label}>Qualifications (one per line)</label>
            <textarea id="a-quals" rows={3} className={input} value={editing.draft.qualifications} onChange={(e) => set('qualifications', e.target.value)} />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label htmlFor="a-yc" className={label}>Years consulting</label>
              <input id="a-yc" type="number" min={0} max={70} className={input} value={editing.draft.yearsConsulting} onChange={(e) => set('yearsConsulting', e.target.value)} />
            </div>
            <div>
              <label htmlFor="a-ye" className={label}>Years of experience</label>
              <input id="a-ye" type="number" min={0} max={70} className={input} value={editing.draft.overallExperience} onChange={(e) => set('overallExperience', e.target.value)} />
            </div>
            <div>
              <label htmlFor="a-order" className={label}>Display order</label>
              <input id="a-order" type="number" min={0} className={input} value={editing.draft.order} onChange={(e) => set('order', e.target.value)} />
              <p className="mt-1 text-xs text-white/40">Lower numbers show first.</p>
            </div>
            <div>
              <label htmlFor="a-li" className={label}>LinkedIn address</label>
              <input id="a-li" className={input} value={editing.draft.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://www.linkedin.com/in/…" />
              {err('linkedin') && <p className="mt-1 text-xs text-red-300">{err('linkedin')}</p>}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={editing.draft.published} onChange={(e) => set('published', e.target.checked)} className="h-4 w-4 accent-[#09947d]" />
            Show on website
          </label>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={busy} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold hover:bg-primary-dark disabled:opacity-60">
              {busy ? 'Saving…' : editing.id ? 'Save changes' : 'Add associate'}
            </button>
            <button type="button" onClick={() => { setEditing(null); setErrors({}) }} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/70 hover:text-white">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-white/50">Loading associates…</p>
      ) : items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-white/15 p-6 text-center text-sm text-white/50">
          No associates yet. Choose “Add associate” to create the first one.
        </p>
      ) : (
        <ul className="divide-y divide-white/10 rounded-xl border border-white/10">
          {items.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="h-14 w-12 overflow-hidden rounded bg-white/10 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {a.photo && <img src={a.photo} alt="" className="h-full w-full object-cover object-top" />}
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="font-semibold">{a.name}</p>
                <p className="text-sm text-white/60">{a.role}</p>
                {!a.bio && <p className="text-xs text-amber-200/80 mt-1">No biography yet</p>}
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.published ? 'bg-primary/30 text-white' : 'bg-white/10 text-white/60'}`}>
                {a.published ? 'On website' : 'Draft'}
              </span>
              <div className="flex gap-1">
                <button onClick={() => togglePublished(a)} disabled={busy} title={a.published ? 'Hide from website' : 'Show on website'}
                  className="rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white" aria-label={a.published ? `Hide ${a.name}` : `Publish ${a.name}`}>
                  {a.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => { setErrors({}); setEditing({ id: a.id, draft: toDraft(a) }) }} disabled={busy}
                  className="rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white" aria-label={`Edit ${a.name}`}>
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(a)} disabled={busy} className="rounded-md p-2 text-red-300/80 hover:bg-red-500/15 hover:text-red-200" aria-label={`Delete ${a.name}`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <a href="/why-team/our-team" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
        View the Leadership page <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </section>
  )
}
