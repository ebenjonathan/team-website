import Link from 'next/link'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Event } from '@/types'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const date = new Date(event.date)
  const day = date.getDate()
  const month = date.toLocaleString('en', { month: 'short' })
  const year = date.getFullYear()

  return (
    <div className="group flex gap-6 p-6 rounded-xl border border-gray-100 bg-white hover:shadow-lg transition-all duration-300">
      <div className="flex-shrink-0 w-16 text-center">
        <div className="bg-primary rounded-xl p-3">
          <span className="text-2xl font-bold text-white font-heading block leading-none">{day}</span>
          <span className="text-xs text-white/80 uppercase tracking-wide">{month}</span>
        </div>
        <span className="text-xs text-body mt-1 block">{year}</span>
      </div>
      <div className="flex-1 min-w-0">
        <Badge variant="light" className="mb-2">
          {event.category}
        </Badge>
        <h3 className="font-bold font-heading text-primary-deeper text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {event.title}
        </h3>
        <div className="flex flex-wrap gap-4 text-sm text-body mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {event.time}
          </span>
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {event.location}
          </span>
        </div>
        <p className="text-sm text-body line-clamp-2 mb-3">{event.description}</p>
        <Link
          href={`/upcoming-events/${event.slug}`}
          className="inline-flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all"
        >
          Register Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
