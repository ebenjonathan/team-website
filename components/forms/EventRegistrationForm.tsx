'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone number is required'),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  specialRequests: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface EventRegistrationFormProps {
  eventId: string
  eventTitle: string
}

export function EventRegistrationForm({ eventId, eventTitle }: EventRegistrationFormProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/event-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, eventId, eventTitle }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-gray-200 text-body placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm'
  const errorClass = 'mt-1 text-xs text-red-500'

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-bold text-primary-deeper mb-2">Registration Confirmed!</h3>
        <p className="text-body text-sm">
          We&apos;ll send event details and reminders to your email address.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input {...register('firstName')} placeholder="First Name *" className={inputClass} />
          {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
        </div>
        <div>
          <input {...register('lastName')} placeholder="Last Name *" className={inputClass} />
          {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
        </div>
      </div>
      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email Address *"
          className={inputClass}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>
      <div>
        <input {...register('phone')} placeholder="Phone Number" className={inputClass} />
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </div>
      <div>
        <input
          {...register('company')}
          placeholder="Organisation / Company"
          className={inputClass}
        />
      </div>
      <div>
        <input
          {...register('jobTitle')}
          placeholder="Job Title"
          className={inputClass}
        />
      </div>
      <div>
        <textarea
          {...register('specialRequests')}
          placeholder="Any questions or special requirements?"
          rows={3}
          className={inputClass + ' resize-none'}
        />
      </div>
      {status === 'error' && (
        <p className="text-sm text-red-500">Registration failed. Please try again.</p>
      )}
      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Confirm Registration
      </Button>
    </form>
  )
}
