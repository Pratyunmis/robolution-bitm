'use client'

import DarkVeil from '@/components/DarkVeil'
import { m } from 'framer-motion'
import { Calendar, MapPin, Users, ExternalLink, Clock } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Event } from '@/payload-types'

interface EventsPageClientProps {
  events: Event[]
}

const statusColors = {
  upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ongoing: 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const categoryColors = {
  workshop: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  competition: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  seminar: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  fest: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  meetup: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  other: 'bg-white/20 text-white/60 border-white/30',
}

const EventsPageClient = ({ events: initialEvents }: EventsPageClientProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const events = [...initialEvents].sort((a, b) => {
    const dateA = new Date(a.eventDate).getTime()
    const dateB = new Date(b.eventDate).getTime()
    return dateB - dateA
  })

  const statuses = ['all', 'upcoming', 'ongoing', 'completed'] as const

  const filteredEvents =
    selectedStatus === 'all' ? events : events.filter((event) => event.status === selectedStatus)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDateRange = (startDate: string, endDate?: string | null) => {
    if (!endDate) return formatDate(startDate)
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-x-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-200 h-[40vh] max-h-100 bg-white/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl mx-auto text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 text-white/50 border border-white/10 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm inline-block">
              What&apos;s Happening
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-linear-to-b from-white via-white to-white/40 px-4">
              Events
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
              Join us for workshops, competitions, and tech talks. Experience innovation in action.
            </p>
          </m.div>
        </div>
      </section>

      {/* Status Filter */}
      <section className="relative z-10 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 capitalize ${
                  selectedStatus === status
                    ? 'bg-white text-black'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {status === 'all' ? 'All Events' : status}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="relative z-10 px-4 pb-32">
        <div className="max-w-7xl mx-auto">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-white/50">No events found.</p>
              <p className="text-sm text-white/30 mt-2">
                Check back soon for upcoming events or add events through the admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => {
                // Helper to get image URL safely
                const imageUrl =
                  typeof event.featuredImage === 'object' && event.featuredImage?.url
                    ? event.featuredImage.url
                    : null
                const imageAlt =
                  (typeof event.featuredImage === 'object' && event.featuredImage?.alt) ||
                  event.title

                return (
                  <m.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group relative"
                  >
                    <div className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105 h-full flex flex-col">
                      {/* Featured Image */}
                      <div className="relative aspect-video overflow-hidden bg-white/5">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="w-16 h-16 text-white/20" />
                          </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-60" />

                        {/* Status & Category Badges */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-2 max-w-[calc(100%-1.5rem)] sm:max-w-[calc(100%-2rem)]">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm capitalize ${statusColors[event.status]} wrap-break-word`}
                          >
                            {event.status}
                          </span>
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm capitalize ${categoryColors[event.category]} wrap-break-word`}
                          >
                            {event.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-6 flex-1 flex flex-col">
                        <h3 className="text-xl sm:text-2xl font-bold mb-3 line-clamp-2 wrap-break-word">
                          {event.title}
                        </h3>

                        <p className="text-sm text-white/60 mb-4 line-clamp-3 flex-1 wrap-break-word">
                          {event.description}
                        </p>

                        {/* Event Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-start gap-2 text-sm text-white/50">
                            <Calendar className="w-4 h-4 shrink-0 mt-0.5" />
                            <span className="wrap-break-word">
                              {formatDateRange(event.eventDate, event.endDate)}
                            </span>
                          </div>

                          {event.location && (
                            <div className="flex items-start gap-2 text-sm text-white/50">
                              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                              <span className="wrap-break-word">{event.location}</span>
                            </div>
                          )}

                          {event.maxParticipants && (
                            <div className="flex items-start gap-2 text-sm text-white/50">
                              <Users className="w-4 h-4 shrink-0 mt-0.5" />
                              <span className="wrap-break-word">
                                Max {event.maxParticipants} participants
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Registration Button */}
                        {event.registrationLink && event.status === 'upcoming' && (
                          <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold rounded-full transition-all hover:scale-105 active:scale-95 gap-2">
                              Register Now
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        )}

                        {event.status === 'ongoing' && (
                          <Button className="w-full bg-green-500 text-white hover:bg-green-600 font-semibold rounded-full gap-2">
                            <Clock className="w-4 h-4 animate-pulse" />
                            Happening Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </m.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 sm:py-32 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 px-4 wrap-break-word">
            Don&apos;t Miss Out
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto px-4 wrap-break-word">
            Stay updated with our latest events and workshops. Subscribe to our newsletter for
            exclusive announcements.
          </p>
          <Link
            href="/#newsletter"
            className="inline-block px-8 sm:px-10 py-4 sm:py-5 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            Subscribe Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default EventsPageClient
