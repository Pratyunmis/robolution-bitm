import { getPayload } from 'payload'
import config from '@/payload.config'
import DarkVeil from '@/components/DarkVeil'
import { renderLexical } from '@/lib/lexicalToHtml'
import { notFound } from 'next/navigation'
import AboutPageClient from './page.client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Robolution - the official robotics and innovation club of BIT Mesra (Team Pratyumnis). Discover our mission, vision, and journey in robotics.',
  alternates: {
    canonical: 'https://www.robolutionbitm.in/about',
  },
  openGraph: {
    title: 'About Us | Robolution | BIT Mesra',
    description:
      'Learn about Robolution - the official robotics and innovation club of BIT Mesra (Team Pratyumnis). Discover our mission, vision, and journey in robotics.',
    url: 'https://www.robolutionbitm.in/about',
  },
}

export const revalidate = 3600

const AboutPage = async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'about-us',
    limit: 1,
  })

  const aboutData = docs[0]

  if (!aboutData) {
    return notFound()
  }

  const mainContentHtml = await renderLexical(aboutData.mainContent)
  const missionHtml = aboutData.mission ? await renderLexical(aboutData.mission) : ''
  const visionHtml = aboutData.vision ? await renderLexical(aboutData.vision) : ''

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-x-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      <div className="relative z-10">
        <AboutPageClient
          data={aboutData}
          mainContentHtml={mainContentHtml}
          missionHtml={missionHtml}
          visionHtml={visionHtml}
        />
      </div>
    </div>
  )
}

export default AboutPage
