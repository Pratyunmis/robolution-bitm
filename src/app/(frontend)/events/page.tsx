import { getPayload } from 'payload'
import config from '@/payload.config'
import EventsPageClient from './page.client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Explore robotics events, workshops, and competitions organized by Robolution at BIT Mesra. Stay updated with our latest tech events and activities.',
  alternates: {
    canonical: 'https://www.robolutionbitm.in/events',
  },
  openGraph: {
    title: 'Events | Robolution | BIT Mesra',
    description:
      'Explore robotics events, workshops, and competitions organized by Robolution at BIT Mesra. Stay updated with our latest tech events and activities.',
    url: 'https://www.robolutionbitm.in/events',
  },
}

export const revalidate = 1800

export default async function EventsPage() {
  const payload = await getPayload({ config })

  const { docs: events } = await payload.find({
    collection: 'events',
    limit: 100, // Adjust limit as needed
    sort: '-eventDate', // Sort by eventDate descending
  })

  return <EventsPageClient events={events} />
}
