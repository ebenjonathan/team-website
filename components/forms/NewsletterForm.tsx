'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type FormData = z.infer<typeof schema>

export function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/subscribe', {
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

  if (status === 'success') {
    return (
      <p className="text-white/70 text-sm">
        Thank you for subscribing! Check your inbox for a confirmation.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex gap-2">
        <input
          {...register('email')}
          type="email"
          placeholder="Your email address"
          className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
        />
        <Button type="submit" variant="white" size="sm" isLoading={isSubmitting}>
          Subscribe
        </Button>
      </div>
      {errors.email && <p className="text-xs text-red-300">{errors.email.message}</p>}
      {status === 'error' && (
        <p className="text-xs text-red-300">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
