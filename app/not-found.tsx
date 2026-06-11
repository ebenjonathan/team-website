import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 py-24 text-center">
      <p className="text-8xl font-extrabold text-primary opacity-20 select-none">404</p>

      <h1 className="mt-6 text-4xl font-bold text-primary-deeper">Page not found</h1>

      <p className="mt-4 max-w-md text-lg text-slate-500">
        The page you are looking for may have been moved, renamed, or no longer exists.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Go to Home
        </Link>
        <Link
          href="/contact-us"
          className="inline-block rounded-lg border border-slate-300 px-8 py-3 font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
        >
          Contact Us
        </Link>
      </div>
    </section>
  )
}
