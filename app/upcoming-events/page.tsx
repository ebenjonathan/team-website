import { Metadata } from 'next'
import Link from 'next/link'
import { EventCard } from '@/components/cards/EventCard'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getEvents } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'Upcoming Events',
  description:
    'Join our upcoming webinars, conferences, and networking events to stay informed on the latest trends.',
}

export default async function UpcomingEventsPage() {
  const events = await getEvents()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Upcoming Events</h1>
          <p className="text-xl text-slate-200 max-w-2xl">
            Join us for webinars, workshops, and conferences on the latest trends in digital transformation.
          </p>
        </div>
      </section>

      {/* Events */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Featured & Upcoming"
            subtitle="Don't miss out on our learning opportunities"
            centered
          />

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {events.map((event) => (
              <Link key={event.id} href={`/upcoming-events/${event.slug}`}>
                <EventCard event={event} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Stay Updated</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates about new events and industry insights.
          </p>
          <div className="max-w-md mx-auto rounded-2xl bg-primary-deeper p-4 text-left">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  )
}
