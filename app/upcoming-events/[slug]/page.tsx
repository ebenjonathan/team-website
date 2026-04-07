import { Metadata } from 'next'
import Link from 'next/link'
import { EventRegistrationForm } from '@/components/forms/EventRegistrationForm'
import { getEventBySlug, getEvents } from '@/lib/sanity/content'

interface EventDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(
  { params }: EventDetailPageProps,
): Promise<Metadata> {
  const resolvedParams = await params
  const event = await getEventBySlug(resolvedParams.slug)

  return {
    title: event?.title,
    description: event?.description,
  }
}

export async function generateStaticParams() {
  const events = await getEvents()

  return events.map((event) => ({
    slug: event.slug,
  }))
}

export default async function EventDetailPage(
  { params }: EventDetailPageProps,
) {
  const resolvedParams = await params
  const event = await getEventBySlug(resolvedParams.slug)

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-slate-600">Event not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4">
          <p className="text-primary-light font-semibold mb-2">{event.category}</p>
          <h1 className="text-5xl font-bold mb-4">{event.title}</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-slate-200">
            <span>📅 {new Date(event.date).toLocaleDateString()}</span>
            <span>🕐 {event.time}</span>
            <span>📍 {event.location}</span>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="bg-primary-light py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Ready to Attend?</h3>
            <p className="text-slate-600 mt-1">Secure your spot today</p>
          </div>
          <Link
            href="#registration-form"
            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-12">
              {/* Description */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">About This Event</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {event.fullDescription ?? event.description}
                </p>
              </div>

              {/* Agenda */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Agenda</h2>
                <div className="space-y-4">
                  {(event.agenda ?? []).map((item, idx) => (
                      <div key={idx} className="border-l-4 border-primary pl-6 py-2">
                        <p className="font-bold text-slate-900">{item.time}</p>
                        <p className="text-slate-600">{item.title}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Speakers */}
              {!!event.speakers?.length && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">Speakers</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {event.speakers?.map((speaker, idx) => (
                      <div key={idx} className="bg-slate-50 p-6 rounded-lg">
                        <h3 className="font-bold text-slate-900 text-lg mb-2">{speaker.name}</h3>
                        <p className="text-slate-600 mb-2">{speaker.title}</p>
                        <p className="text-slate-500 text-sm">{speaker.company}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Key Details */}
              <div className="bg-slate-50 p-8 rounded-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Event Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-600 text-sm">Date</p>
                    <p className="font-bold text-slate-900">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm">Time</p>
                    <p className="font-bold text-slate-900">{event.time}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm">Location</p>
                    <p className="font-bold text-slate-900">{event.location}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm">Category</p>
                    <p className="font-bold text-slate-900">{event.category}</p>
                  </div>
                </div>
              </div>

              <div id="registration-form" className="bg-white border border-slate-200 p-6 rounded-lg">
                <h4 className="font-bold text-slate-900 mb-4">Register for This Event</h4>
                <EventRegistrationForm eventId={event.id} eventTitle={event.title} />
              </div>

              {/* Share */}
              <div className="bg-white border border-slate-200 p-6 rounded-lg">
                <h4 className="font-bold text-slate-900 mb-4">Share Event</h4>
                <div className="flex gap-4">
                  <a href="#" className="text-slate-600 hover:text-primary">
                    Twitter
                  </a>
                  <a href="#" className="text-slate-600 hover:text-primary">
                    LinkedIn
                  </a>
                  <a href="#" className="text-slate-600 hover:text-primary">
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
