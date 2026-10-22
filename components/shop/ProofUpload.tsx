'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const MAX = 4 * 1024 * 1024

export function ProofUpload({ invoiceNumber, token, alreadySent }: { invoiceNumber: string; token: string; alreadySent: boolean }) {
  const router = useRouter()
  const input = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const file = input.current?.files?.[0]
    if (!file) {
      setState('error')
      setMessage('Choose a file first.')
      return
    }
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      setState('error')
      setMessage('Upload a PDF, JPG or PNG file.')
      return
    }
    if (file.size > MAX) {
      setState('error')
      setMessage('The file is larger than 4 MB. Please reply to your invoice email with it attached instead.')
      return
    }
    setState('sending')
    const body = new FormData()
    body.append('file', file)
    try {
      const res = await fetch(`/api/shop/orders/${encodeURIComponent(invoiceNumber)}/proof?k=${encodeURIComponent(token)}`, {
        method: 'POST',
        body,
      })
      const json = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string }
      if (res.ok && json.success) {
        setState('done')
        setMessage('Thank you. We’ve received your proof of payment and will confirm by email once the payment reflects.')
        router.refresh()
      } else {
        setState('error')
        setMessage(res.status === 429 ? 'Too many uploads. Please wait a few minutes.' : json.message ?? 'Upload failed. Please try again.')
      }
    } catch {
      setState('error')
      setMessage('Upload failed. Check your connection and try again.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xs border border-gray-200 p-6">
      <h2 className="font-heading font-bold text-xl text-primary-deeper">Upload proof of payment</h2>
      <p className="mt-2 text-body">
        {alreadySent
          ? 'We have your proof of payment. If you need to send another file, upload it here.'
          : 'Once you have paid, upload your bank’s confirmation here. PDF, JPG or PNG, up to 4 MB.'}
      </p>
      <input
        ref={input}
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        className="mt-4 block w-full text-sm text-body file:mr-4 file:rounded-md file:border-0 file:bg-primary-muted file:px-4 file:py-2 file:font-semibold file:text-primary-deeper"
        aria-label="Proof of payment file"
      />
      <button
        type="submit"
        disabled={state === 'sending'}
        className="mt-4 px-6 py-3 rounded-md font-semibold bg-primary text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {state === 'sending' ? 'Uploading…' : 'Upload'}
      </button>
      {message && (
        <p role="status" className={`mt-3 text-sm ${state === 'error' ? 'text-red-700' : 'text-primary-deeper'}`}>
          {message}
        </p>
      )}
    </form>
  )
}
