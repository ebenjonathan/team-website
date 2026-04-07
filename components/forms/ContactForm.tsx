'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  organisation: z.string().min(2, 'Organisation is required'),
  country: z.string().min(2, 'Country is required'),
  requestType: z.string().min(2, 'Nature of request is required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type FormData = z.infer<typeof schema>

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm'
  const errorClass = 'mt-1 text-xs text-red-500'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <input {...register('name')} placeholder="Your Name *" className={inputClass} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="Your Email *"
            className={inputClass}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <input
            {...register('organisation')}
            placeholder="Organisation *"
            className={inputClass}
          />
          {errors.organisation && <p className={errorClass}>{errors.organisation.message}</p>}
        </div>
        <div>
          <input {...register('country')} placeholder="Country *" className={inputClass} />
          {errors.country && <p className={errorClass}>{errors.country.message}</p>}
        </div>
      </div>

      <div>
        <select {...register('requestType')} className={inputClass}>
          <option value="">Nature of Request *</option>
          <option value="strategy-workshop">Strategy Workshop</option>
          <option value="greater-diagnostic">GREATER Diagnostic</option>
          <option value="wellness-coaching">Wellness & Coaching</option>
          <option value="event-registration">Event / Training</option>
          <option value="general-inquiry">General Inquiry</option>
        </select>
        {errors.requestType && <p className={errorClass}>{errors.requestType.message}</p>}
      </div>

      <div>
        <textarea
          {...register('message')}
          placeholder="Your Message *"
          rows={6}
          className={inputClass + ' resize-none'}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      {status === 'success' && (
        <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          Message sent successfully. We&apos;ll get back to you shortly.
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Something went wrong. Please try again or email us directly at info@team.co.zw.
        </div>
      )}

      <Button type="submit" isLoading={isSubmitting} size="lg">
        Send Message
      </Button>
    </form>
  )
}
