import { NewsletterForm } from '@/components/forms/NewsletterForm'

export function NewsletterSection() {
  return (
    <section className="bg-primary-deeper py-20">
      <div className="container mx-auto grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs text-primary uppercase tracking-[0.2em] font-bold mb-4">
            Stay Connected
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Stay Updated with TEAM
          </h2>
          <p className="text-white/65 leading-relaxed max-w-md">
            Subscribe for new Ideas at Work articles, event announcements, and
            insight updates from TEAM Consulting.
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}
