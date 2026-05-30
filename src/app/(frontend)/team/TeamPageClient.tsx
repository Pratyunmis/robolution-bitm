'use client'

import React from 'react'
import { FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa'
import { IoIosMail } from 'react-icons/io'
import { Card, CardContent } from '@/components/ui/card'
import DarkVeil from '@/components/DarkVeil'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Define types for better type safety
interface Socials {
  linkedin?: string | null
  instagram?: string | null
  facebook?: string | null
  email?: string | null
}

interface Member {
  id: string | number
  name: string
  title: string
  image?: { url: string; alt?: string } | null
  socials?: Socials
  category: string
  year?: string
  order?: number
}

interface TeamPageClientProps {
  members: Member[]
}

const MemberCard = ({ member, className }: { member: Member; className?: string }) => {
  const [isLoaded, setIsLoaded] = React.useState(false)

  if (!member) return null

  // Helper to determine image source
  let imageSrc = ''
  if (member.image && typeof member.image === 'object' && member.image.url) {
    imageSrc = member.image.url
  }

  return (
    <Card
      className={cn(
        'group relative flex flex-col items-center py-6 md:m-2 w-full max-w-xs sm:max-w-md md:max-w-87.5 h-80 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/10',
        className,
      )}
    >
      <CardContent className="flex flex-col items-center">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-4 overflow-hidden rounded-full">
          {imageSrc ? (
            <>
              {/* Shimmer loading mask */}
              {!isLoaded && (
                <div className="absolute inset-0 rounded-full border-2 border-white/20 shimmer z-10" />
              )}
              <Image
                src={imageSrc}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={cn(
                  'rounded-full border-2 border-white/20 shadow-lg object-cover scale-95 group-hover:scale-100 transition-all duration-500',
                  isLoaded ? 'opacity-100 blur-0 scale-95' : 'opacity-0 blur-md scale-90',
                )}
                onLoad={() => setIsLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full rounded-full border-2 border-white/20 shadow-lg bg-gray-800 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white/20">
              {member.name.charAt(0)}
            </div>
          )}
        </div>

        <p className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors duration-300 text-center px-2">
          {member.name}
        </p>
        <p className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300 text-center mb-4 px-2">
          {member.title}
        </p>
        <div className="flex space-x-4 mt-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          {member.socials?.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#0077B5] transition-colors duration-200 text-xl sm:text-2xl"
            >
              <FaLinkedin />
            </a>
          )}
          {member.socials?.instagram && (
            <a
              href={member.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#E4405F] transition-colors duration-200 text-xl sm:text-2xl"
            >
              <FaInstagram />
            </a>
          )}
          {member.socials?.facebook && (
            <a
              href={member.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#1877F2] transition-colors duration-200 text-xl sm:text-2xl"
            >
              <FaFacebook />
            </a>
          )}
          {member.socials?.email && (
            <a
              href={`mailto:${member.socials.email}`}
              className="text-gray-400 hover:text-[#FED853] transition-colors duration-200 text-xl sm:text-2xl"
            >
              <IoIosMail />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const renderMemberRow = (members: Member[], keyPrefix: string) => {
  if (!members || members.length === 0) return null
  return (
    <div className="flex flex-wrap justify-center items-stretch gap-4 sm:gap-6 py-2 sm:py-4">
      {members.map((member) => (
        <MemberCard
          className="w-full px-6 md:w-64 lg:w-[320px]"
          key={`${keyPrefix}-${member.id}`}
          member={member}
        />
      ))}
    </div>
  )
}

const HeroSection = () => (
  <div className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden mb-12 md:mb-20">
    <div className="relative z-10 text-center px-4">
      <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] mb-4 md:mb-6 text-white/50">
        The Minds Behind Innovation
      </p>
      <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white via-white to-white/40 pb-1 md:pb-2 px-2 md:px-4">
        Our Team
      </h2>
      <p className="text-sm sm:text-base md:text-2xl text-white/60 max-w-xl md:max-w-2xl mx-auto px-2 md:px-4 mt-2">
        Meet the passionate individuals driving Robolution forward
      </p>
    </div>
  </div>
)

// const TimelineSection = () => (
//   <div className="w-full py-20 bg-white/5 mx-auto max-w-6xl rounded-3xl border border-white/10 my-20 p-8 md:p-12 flex flex-col items-center backdrop-blur-md">
//     <div className="text-center mb-12">
//       <p className="text-sm uppercase tracking-[0.4em] text-white/50 mb-4">Our Journey</p>
//       <h3 className="text-4xl md:text-5xl font-bold text-white">Evolution of Excellence</h3>
//     </div>
//     <div className="grid md:grid-cols-3 gap-6 w-full">
//       <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 text-center md:text-left">
//         <div className="text-4xl font-bold text-white mb-3">2001</div>
//         <h4 className="text-xl font-bold text-white mb-2">Foundation</h4>
//         <p className="text-white/60">
//           Robolution was established as BIT Mesra&apos;s official robotics club
//         </p>
//       </div>
//       <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 text-center md:text-left">
//         <div className="text-4xl font-bold text-white mb-3">2021</div>
//         <h4 className="text-xl font-bold text-white mb-2">Perfect Score</h4>
//         <p className="text-white/60">Achieved 100/100 in 3D design analysis at ABU ROBOCON</p>
//       </div>
//       <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all hover:scale-105 text-center md:text-left">
//         <div className="text-4xl font-bold text-white mb-3">2025</div>
//         <h4 className="text-xl font-bold text-white mb-2">Future Forward</h4>
//         <p className="text-white/60">
//           Leading innovation hub, hosting workshops and building future tech
//         </p>
//       </div>
//     </div>
//   </div>
// )

export default function TeamPageClient({ members }: TeamPageClientProps) {
  // Define categories in the desired hierarchical order
  const categoriesOrder = [
    { value: 'president', label: 'President' },
    { value: 'vice_president', label: 'Vice President' },
    { value: 'joint_president', label: 'Joint President' },
    { value: 'captain', label: 'Captain' },
    { value: 'vice_captain', label: 'Vice Captain' },
    { value: 'general_secretary', label: 'General Secretary' },
    { value: 'joint_secretary', label: 'Joint Secretary' },
    { value: 'design_lead', label: 'Design Lead' },
    { value: 'treasurer', label: 'Treasurer' },
    { value: 'embedded_head', label: 'Embedded Head' },
    { value: 'mechanical_head', label: 'Mechanical Head' },
    { value: 'management_lead', label: 'Management Lead' },
    { value: 'web_master', label: 'Web Master' },
    { value: 'intelligence_head', label: 'Intelligence Head' },
    { value: 'public_relations_head', label: 'Public Relations Head' },
  ] as const

  // Initialize grouped members
  const membersByCategory: Record<string, Member[]> = {}
  categoriesOrder.forEach((cat) => {
    membersByCategory[cat.value] = []
  })

  // Group members by category, ignoring any categories not in the list
  members.forEach((m) => {
    if (m.category in membersByCategory) {
      membersByCategory[m.category].push(m)
    }
  })

  // Helpers to check if groups have any members
  const hasPresidents =
    membersByCategory['president'].length > 0 ||
    membersByCategory['vice_president'].length > 0 ||
    membersByCategory['joint_president'].length > 0

  const hasCaptains =
    membersByCategory['captain'].length > 0 ||
    membersByCategory['vice_captain'].length > 0

  const hasSecretaries =
    membersByCategory['general_secretary'].length > 0 ||
    membersByCategory['joint_secretary'].length > 0

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans relative overflow-x-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      <div className="relative z-10 pt-24 pb-16 md:pb-20">
        <HeroSection />

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-white/50 mb-3 sm:mb-4">
              Meet The Team
            </p>
          </div>
        </div>

        {/* PRESIDENTS Section */}
        {hasPresidents && (
          <section className="my-12 md:my-20 px-4 max-w-7xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white/90 mb-8 md:mb-12 tracking-wide uppercase border-b border-white/10 pb-3 md:pb-4">
              PRESIDENTS
            </h2>
            <div>
              {/* President - Center */}
              {renderMemberRow(membersByCategory['president'], 'president')}

              {/* Vice President and Joint President - Side by side */}
              <div className="flex justify-center">
                {renderMemberRow(
                  [...membersByCategory['vice_president'], ...membersByCategory['joint_president']],
                  'vice-president-joint-president',
                )}
              </div>
            </div>
          </section>
        )}

        {/* CAPTAINS Section */}
        {hasCaptains && (
          <section className="my-12 md:my-20 px-4 max-w-7xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white/90 mb-8 md:mb-12 tracking-wide uppercase border-b border-white/10 pb-3 md:pb-4">
              CAPTAINS
            </h2>
            <div>
              {/* Captain - Center */}
              {renderMemberRow(membersByCategory['captain'], 'captain')}

              {/* Vice Captains - Side by side */}
              <div className="flex flex-wrap justify-center gap-6">
                {renderMemberRow(membersByCategory['vice_captain'], 'vice-captain')}
              </div>
            </div>
          </section>
        )}

        {/* SECRETARIES Section */}
        {hasSecretaries && (
          <section className="my-12 md:my-20 px-4 max-w-7xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white/90 mb-8 md:mb-12 tracking-wide uppercase border-b border-white/10 pb-3 md:pb-4">
              SECRETARIES
            </h2>
            <div>
              {/* General Secretary - Center */}
              {renderMemberRow(membersByCategory['general_secretary'], 'general-secretary')}

              {/* Joint Secretaries - Side by side */}
              <div className="flex flex-wrap justify-center gap-6">
                {renderMemberRow(membersByCategory['joint_secretary'], 'joint-secretary')}
              </div>
            </div>
          </section>
        )}

        {/* Individual role sections in hierarchy order */}
        {[
          { key: 'design_lead', label: 'Design Lead' },
          { key: 'treasurer', label: 'Treasurer' },
          { key: 'embedded_head', label: 'Embedded Head' },
          { key: 'mechanical_head', label: 'Mechanical Head' },
          { key: 'management_lead', label: 'Management Lead' },
          { key: 'web_master', label: 'Web Master' },
          { key: 'intelligence_head', label: 'Intelligence Head' },
          { key: 'public_relations_head', label: 'Public Relations Head' },
        ].map(({ key, label }) => {
          const catMembers = membersByCategory[key]
          if (!catMembers || catMembers.length === 0) return null

          return (
            <section key={key} className="my-12 md:my-20 px-4 max-w-7xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-white/90 mb-8 md:mb-12 tracking-wide uppercase border-b border-white/10 pb-3 md:pb-4">
                {label}
              </h2>
              {renderMemberRow(catMembers, key)}
            </section>
          )
        })}
      </div>
    </div>
  )
}
