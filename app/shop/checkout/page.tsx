import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/shop/CheckoutForm'

export const metadata: Metadata = {
  title: 'Checkout | Shop',
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <section className="bg-white">
      <div className="container mx-auto py-12 md:py-16">
        <p className="text-sm font-semibold text-primary mb-3">
          <span aria-hidden>— </span>Checkout
        </p>
        <h1 className="font-heading font-bold text-primary-deeper text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-[-0.02em]">
          Request your invoice
        </h1>
        <p className="mt-4 text-lg text-body max-w-[60ch]">
          We email you a pro-forma invoice with our bank details. Pay by bank transfer, upload your proof of payment, and we deliver
          within 3 working days of confirming it.
        </p>
        <div className="mt-10">
          <CheckoutForm />
        </div>
      </div>
    </section>
  )
}
