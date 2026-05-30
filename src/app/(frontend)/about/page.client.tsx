'use client'
import { m } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import Link from 'next/link'
import { AboutUs } from '@/payload-types'

interface AboutPageClientProps {
  data: AboutUs
  mainContentHtml: string
  missionHtml: string
  visionHtml: string
}

const AboutPageClient = ({
  data,
  mainContentHtml,
  missionHtml,
  visionHtml,
}: AboutPageClientProps) => {
  const { values, achievements } = data

  return (
    <>
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-white/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl mx-auto text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs md:text-base uppercase tracking-[0.2em] md:tracking-[0.3em] mb-6 text-white/50 border border-white/10 px-3 md:px-4 py-2 rounded-full backdrop-blur-sm inline-block">
              {data.heroTitle}
            </p>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-linear-to-b from-white via-white to-white/40 px-4">
              {data.title}
            </h1>

            {data.heroSubtitle && (
              <p className="text-base md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
                {data.heroSubtitle}
              </p>
            )}
          </m.div>
        </div>
      </section>

      {/* Main Content (Who Are We) */}
      <section className="relative z-10 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="space-y-4 md:space-y-6 text-sm md:text-lg text-white/70 leading-relaxed prose prose-invert max-w-none prose-p:text-sm md:prose-p:text-lg"
              dangerouslySetInnerHTML={{ __html: mainContentHtml }}
            />

            <div className="mt-10 text-center">
              <Link
                href="/team"
                className="inline-block px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
              >
                Meet our team →
              </Link>
            </div>
          </m.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="relative z-10 py-20 px-4 bg-black/50 backdrop-blur-lg border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center px-4">
              Our Vision & Mission
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Vision */}
              {data.vision && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <LucideIcons.Target className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">Vision</h3>
                  </div>
                  <div
                    className="text-white/70 leading-relaxed prose prose-invert"
                    dangerouslySetInnerHTML={{ __html: visionHtml }}
                  />
                </div>
              )}

              {/* Mission */}
              {data.mission && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <LucideIcons.Rocket className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold">Mission</h3>
                  </div>
                  <div
                    className="text-white/70 prose prose-invert" // prose handles lists
                    dangerouslySetInnerHTML={{ __html: missionHtml }}
                  />
                </div>
              )}
            </div>
          </m.div>
        </div>
      </section>

      {/* Our Values Section */}
      {values && values.length > 0 && (
        <section className="relative z-10 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center px-4">Our Values</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon
                    ? LucideIcons[value.icon as keyof typeof LucideIcons]
                    : LucideIcons.HelpCircle
                  return (
                    <m.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all text-center group"
                    >
                      <div className="mb-4 flex justify-center">
                        <div className="p-4 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                          {/* @ts-expect-error - Dynamic icon component type mismatch */}
                          <Icon className="w-8 h-8" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                      <p className="text-sm text-white/60 leading-relaxed">{value.description}</p>
                    </m.div>
                  )
                })}
              </div>
            </m.div>
          </div>
        </section>
      )}

      {/* Our Journey Timeline */}
      {achievements && achievements.length > 0 && (
        <section className="relative z-10 py-20 px-4 bg-black/50 backdrop-blur-lg border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Our Journey</h2>

              <div className="space-y-8">
                {achievements.map((milestone, index) => (
                  <m.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-32 shrink-0">
                        <div className="text-5xl font-black text-white/90">{milestone.year}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">{milestone.title}</h3>
                        <p className="text-white/60 leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                  </m.div>
                ))}
              </div>
            </m.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 px-4">Join Our Journey</h2>
          <p className="text-base md:text-xl text-white/70 mb-10 max-w-2xl mx-auto px-4">
            Be part of something extraordinary. Join Robolution and shape the future of robotics.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/team"
              className="inline-block px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
            >
              Meet the Team
            </Link>
            <Link
              href="/events"
              className="inline-block px-10 py-5 bg-white/5 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
              View Events
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPageClient
