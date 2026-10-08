'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { enquiryTopics, enquiryTopicValues, type EnquiryTopic } from '@/lib/data/enquiry'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name.'),
  email: z.string().trim().email('Enter an email address we can reply to, like name@company.com.'),
  phone: z.string().trim().max(40).optional(),
  organisation: z.string().trim().min(2, 'Enter your organisation’s name.'),
  country: z.string().trim().min(2, 'Enter the country you are based in.'),
  requestType: z.enum(enquiryTopicValues, { errorMap: () => ({ message: 'Choose what your enquiry is about.' }) }),
  message: z
    .string()
    .trim()
    .min(20, 'Tell us a little more: at least 20 characters helps us reply usefully.')
    .max(5000, 'Keep your message under 5,000 characters.'),
  website: z.string().optional(),
})

type FormData = z.infer<typeof schema>

type Status =
  | { kind: 'idle' }
  | { kind: 'sent'; name: string }
  | { kind: 'failed'; reason: 'rate' | 'delivery' | 'network'; data: FormData }

const OFFICE_EMAIL = 'info@team.co.zw'

function mailtoFor(data: FormData) {
  const topic = enquiryTopics.find((t) => t.value === data.requestType)?.label ?? 'Enquiry'
  const body = [
    data.message,
    '',
    `Name: ${data.name}`,
    `Organisation: ${data.organisation}`,
    `Country: ${data.country}`,
    data.phone ? `Phone: ${data.phone}` : '',
  ]
    .filter(Boolean)
    .join('\n')
  return `mailto:${OFFICE_EMAIL}?subject=${encodeURIComponent(`${topic} enquiry from ${data.name}`)}&body=${encodeURIComponent(body)}`
}

export function ContactForm({ defaultTopic = 'general' }: { defaultTopic?: EnquiryTopic }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const statusRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { requestType: defaultTopic },
    shouldFocusError: true,
  })

  const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus())

  const onSubmit = async (data: FormData) => {
    setStatus({ kind: 'idle' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus({ kind: 'sent', name: data.name.split(' ')[0] })
        reset({ requestType: defaultTopic })
      } else {
        setStatus({ kind: 'failed', reason: res.status === 429 ? 'rate' : 'delivery', data })
      }
    } catch {
      setStatus({ kind: 'failed', reason: 'network', data })
    }
    focusStatus()
  }

  if (status.kind === 'sent') {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="border-t-2 border-primary pt-6 outline-none"
      >
        <p className="font-heading font-bold text-2xl text-primary-deeper">
          Thank you, {status.name}. Your enquiry is with us.
        </p>
        <p className="mt-3 text-body leading-relaxed max-w-[52ch]">
          A principal consultant will reply within two business days. We have also sent a copy to
          your inbox. If it is urgent, call us on{' '}
          <a href="tel:+263772202290" className="font-semibold text-primary-deeper underline">
            +263 77 220 2290
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: 'idle' })}
          className="mt-6 font-semibold text-primary-deeper underline underline-offset-4 decoration-2 hover:text-primary"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  const field =
    'w-full px-4 py-3 rounded-md border bg-white text-primary-deeper placeholder-body/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
  const fieldCls = (hasError: boolean) => cn(field, hasError ? 'border-red-600' : 'border-gray-300')
  const label = 'block text-sm font-semibold text-primary-deeper mb-1.5'
  const err = 'mt-1.5 text-sm text-red-700'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" aria-describedby="enquiry-note">
      {status.kind === 'failed' && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-900 outline-none"
        >
          <p className="font-semibold">
            {status.reason === 'rate'
              ? 'You have sent several enquiries in the last minute.'
              : status.reason === 'network'
                ? 'We could not reach our server. Check your connection.'
                : 'Your enquiry could not be delivered.'}
          </p>
          <p className="mt-1">
            {status.reason === 'rate' ? 'Wait a minute and send it again, or ' : 'Try again, or '}
            <a href={mailtoFor(status.data)} className="font-semibold underline">
              send the same message by email
            </a>{' '}
            to {OFFICE_EMAIL}. Nothing you typed has been lost.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="enq-name" className={label}>Your name</label>
          <input id="enq-name" autoComplete="name" {...register('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'enq-name-err' : undefined} className={fieldCls(!!errors.name)} />
          {errors.name && <p id="enq-name-err" className={err}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="enq-email" className={label}>Work email</label>
          <input id="enq-email" type="email" autoComplete="email" {...register('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'enq-email-err' : undefined} className={fieldCls(!!errors.email)} />
          {errors.email && <p id="enq-email-err" className={err}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="enq-org" className={label}>Organisation</label>
          <input id="enq-org" autoComplete="organization" {...register('organisation')} aria-invalid={!!errors.organisation} aria-describedby={errors.organisation ? 'enq-org-err' : undefined} className={fieldCls(!!errors.organisation)} />
          {errors.organisation && <p id="enq-org-err" className={err}>{errors.organisation.message}</p>}
        </div>
        <div>
          <label htmlFor="enq-country" className={label}>Country</label>
          <input id="enq-country" autoComplete="country-name" {...register('country')} aria-invalid={!!errors.country} aria-describedby={errors.country ? 'enq-country-err' : undefined} className={fieldCls(!!errors.country)} />
          {errors.country && <p id="enq-country-err" className={err}>{errors.country.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="enq-topic" className={label}>What is it about?</label>
          <select id="enq-topic" {...register('requestType')} aria-invalid={!!errors.requestType} className={fieldCls(!!errors.requestType)}>
            {enquiryTopics.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.requestType && <p className={err}>{errors.requestType.message}</p>}
        </div>
        <div>
          <label htmlFor="enq-phone" className={label}>
            Phone <span className="font-normal text-body/70">(optional)</span>
          </label>
          <input id="enq-phone" type="tel" autoComplete="tel" {...register('phone')} className={fieldCls(false)} />
        </div>
      </div>

      <div>
        <label htmlFor="enq-message" className={label}>How can we help?</label>
        <textarea
          id="enq-message"
          rows={6}
          {...register('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'enq-message-err' : 'enq-message-hint'}
          className={cn(fieldCls(!!errors.message), 'resize-y')}
        />
        {errors.message ? (
          <p id="enq-message-err" className={err}>{errors.message.message}</p>
        ) : (
          <p id="enq-message-hint" className="mt-1.5 text-sm text-body/70">
            A sentence or two on the challenge, your timeline and who is involved is plenty.
          </p>
        )}
      </div>

      {/* Honeypot for spam bots, hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="enq-website">Leave this field empty</label>
        <input id="enq-website" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md font-semibold bg-primary text-white hover:bg-primary-dark disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {isSubmitting ? 'Sending enquiry…' : 'Send enquiry'}
          {!isSubmitting && <span aria-hidden>→</span>}
        </button>
        <p id="enquiry-note" className="text-sm text-body/70">
          We reply within two business days. See our{' '}
          <a href="/privacy" className="underline">privacy policy</a>.
        </p>
      </div>
    </form>
  )
}
