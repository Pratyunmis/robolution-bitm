'use client'

import React from 'react'
import { HeroSection } from '@/components/landing/HeroSection'
import { MarqueeSection } from '@/components/landing/MarqueeSection'
import { AboutSection } from '@/components/landing/AboutSection'
import { ProjectsSection } from '@/components/landing/ProjectsSection'
import { FadeIn } from '@/components/landing/FadeIn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DarkVeil from '@/components/DarkVeil'
import {
  Users,
  Trophy,
  Zap,
  Code2,
  Mail,
  Send,
  LockIcon,
  Award,
  Medal,
  Star,
  Cpu,
} from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import Link from 'next/link'
import CountUp from '@/components/CountUp'
import { motion as m } from 'framer-motion'
import { SponsorsSection } from '@/components/SponsorsSection'
import { GalleryPreview } from '@/components/GalleryPreview'

interface Sponsor {
  id: string
  name: string
  logo: { url: string; alt?: string; width?: number; height?: number }
  website?: string
  description?: string
  active: boolean
  order: number
}

interface GalleryImage {
  id: string
  title: string
  image: { url: string; alt?: string; width?: number; height?: number }
  category?: string
}

interface HomeClientProps {
  sponsors: Sponsor[]
  galleryImages: GalleryImage[]
}

export const HomeClient: React.FC<HomeClientProps> = ({ sponsors = [], galleryImages = [] }) => {
  const [email, setEmail] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage({ type: 'success', text: 'Successfully subscribed to our newsletter!' })
        setEmail('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to subscribe. Please try again.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="main-wrapper min-h-screen bg-[#0C0C0C] text-[#D7E2EA] selection:bg-white/20 font-sans overflow-x-clip relative">
      {/* ─── Fixed DarkVeil Dynamic Background Shader ─── */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      {/* 1. HERO SECTION */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      {/* 2. MARQUEE SECTION (Zero-lag hardware accelerated) */}
      <div className="relative z-10">
        <MarqueeSection />
      </div>

      {/* 3. ABOUT SECTION */}
      <div className="relative z-10">
        <AboutSection />
      </div>

      {/* 4. PROJECTS SECTION */}
      <div className="relative z-10">
        <ProjectsSection />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          5. HALL OF FAME & ACHIEVEMENTS
      ══════════════════════════════════════════════════════════════ */}
      <section id="achievements" className="relative z-20 py-24 sm:py-32 px-4 sm:px-8 md:px-12 bg-transparent">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
            <FadeIn delay={0} y={15}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D7E2EA]/70">
                  Hall of Fame
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} y={25} className="w-full">
              <h2
                className="hero-heading font-black uppercase tracking-tight text-center leading-none"
                style={{ fontSize: 'clamp(2.4rem, 7.5vw, 105px)' }}
              >
                Victories &amp; Legacy
              </h2>
            </FadeIn>

            <FadeIn delay={0.2} y={15}>
              <p className="text-sm sm:text-base md:text-lg text-[#D7E2EA]/60 max-w-2xl mx-auto mt-4 font-normal">
                Proven engineering excellence and podium finishes across national &amp; international arenas.
              </p>
            </FadeIn>
          </div>

          {/* 4 Victory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {[
              {
                icon: Trophy,
                year: 'Robocon 2013',
                title: 'Best Rookie Team',
                desc: 'Recognized as the best newcomer team in our debut year of participation at the international ABU Robocon competition.',
              },
              {
                icon: Award,
                year: 'Robocon 2015',
                title: '₹50,000 Award by MathWorks',
                desc: 'Awarded the prestigious national award for pioneering mechanical design and advanced mathematical simulations.',
              },
              {
                icon: Medal,
                year: 'Robocon 2015',
                title: 'Best Non-Quarterfinalist',
                desc: 'Honored for outstanding engineering architecture, precision actuation, and technical consistency among national teams.',
              },
              {
                icon: Star,
                year: 'Techfest IIT Bombay',
                title: '2nd Prize in Pixelate',
                desc: 'Secured 2nd place in Pixelate, an advanced autonomous image processing and real-time computer vision robotics challenge.',
              },
            ].map((item, i) => (
              <FadeIn
                key={i}
                delay={i * 0.08}
                y={20}
                className="group relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-white/25 rounded-3xl p-7 sm:p-8 backdrop-blur-xl transition-all duration-300 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
              >
                {/* Subtle dark purple ambient corner glow */}
                <div className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 bg-[#5227FF]/10 rounded-full blur-2xl group-hover:bg-[#5227FF]/20 transition-all duration-500" />

                <div className="relative flex gap-5 sm:gap-6 items-start">
                  <div className="shrink-0 w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-[#D7E2EA] group-hover:bg-white group-hover:text-black group-hover:scale-105 transition-all duration-300 shadow-md">
                    <item.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#D7E2EA]/50 font-semibold mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tight text-[#D7E2EA] group-hover:text-white transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[#D7E2EA]/60 font-light leading-relaxed text-sm sm:text-base">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. OUR TRACK RECORD & TIMELINE
      ══════════════════════════════════════════════════════════════ */}
      <section id="track-record" className="relative z-20 py-24 sm:py-32 px-4 sm:px-8 md:px-12 bg-transparent">
        <div className="max-w-6xl mx-auto text-center">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
            <FadeIn delay={0} y={15}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-6">
                <span className="w-2 h-2 rounded-full bg-[#5227FF] shadow-[0_0_8px_rgba(82,39,255,0.8)]" />
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D7E2EA]/70">
                  Our Track Record
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} y={25} className="w-full">
              <h2
                className="hero-heading font-black uppercase tracking-tight text-center leading-none"
                style={{ fontSize: 'clamp(2.4rem, 7.5vw, 105px)' }}
              >
                24+ Years of Innovation
              </h2>
            </FadeIn>

            <FadeIn delay={0.2} y={15}>
              <p className="text-sm sm:text-base md:text-lg text-[#D7E2EA]/60 max-w-2xl mx-auto mt-4 font-normal">
                Over two decades of hands-on engineering, technical training, and collegiate robotics leadership.
              </p>
            </FadeIn>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-16 sm:mb-20">
            {[
              { label: 'Audience Reach', value: 5000, icon: Users },
              { label: 'Industry Partners', value: 50, icon: Zap },
              { label: 'Workshops Hosted', value: 20, icon: Code2 },
              { label: 'Engineers Trained', value: 1000, icon: Trophy },
            ].map((stat, i) => (
              <FadeIn
                key={i}
                delay={i * 0.08}
                y={20}
                className="group relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-white/25 p-6 sm:p-8 rounded-3xl text-left backdrop-blur-xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
              >
                <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 mb-4 text-[#D7E2EA]/50 group-hover:text-[#D7E2EA] transition-colors" />
                <div className="text-3xl sm:text-5xl font-black text-[#D7E2EA] mb-2 flex items-center">
                  <CountUp from={0} to={stat.value} duration={1.2} delay={0.1} startWhen={true} />
                  <span>+</span>
                </div>
                <div className="text-xs uppercase tracking-wider text-[#D7E2EA]/50 font-semibold font-mono">
                  {stat.label}
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Timeline Highlights (3 Landmark Milestones) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                year: '2001',
                title: 'Foundation',
                desc: 'Robolution was established as BIT Mesra’s official robotics & innovation club.',
              },
              {
                year: '2021',
                title: '100/100 Robocon',
                desc: 'Achieved a historic perfect score of 100 in 3D CAD design analysis at ABU ROBOCON.',
              },
              {
                year: '2025',
                title: 'Autonomous Future',
                desc: 'Advancing autonomous mobile robots, robotic vision, and combat engineering.',
              },
            ].map((item, i) => (
              <FadeIn
                key={i}
                delay={i * 0.1}
                y={20}
                className="group relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-white/25 rounded-3xl p-7 sm:p-8 text-left backdrop-blur-xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
              >
                <div className="font-mono text-3xl sm:text-4xl font-black text-[#D7E2EA] mb-3 group-hover:text-white transition-colors">
                  {item.year}
                </div>
                <h4 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#D7E2EA] mb-2">
                  {item.title}
                </h4>
                <p className="text-[#D7E2EA]/60 font-light leading-relaxed text-sm sm:text-base">
                  {item.desc}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SPONSORS */}
      {sponsors.length > 0 && (
        <div className="relative z-20">
          <SponsorsSection sponsors={sponsors} />
        </div>
      )}

      {/* 8. GALLERY PREVIEW */}
      {galleryImages.length > 0 && (
        <div className="relative z-20">
          <GalleryPreview images={galleryImages} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          9. JOIN THE REVOLUTION CTA
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 py-28 sm:py-36 px-4 sm:px-8 md:px-12 bg-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn delay={0} y={25}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D7E2EA]/70">
                Join the Movement
              </span>
            </div>

            <h2
              className="hero-heading font-black uppercase tracking-tight text-center leading-none mb-6"
              style={{ fontSize: 'clamp(2.4rem, 7.5vw, 95px)' }}
            >
              Join the Revolution
            </h2>
            <p className="text-base sm:text-xl md:text-2xl text-[#D7E2EA]/70 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Whether you&apos;re a curious beginner or a seasoned builder, Robolution offers a platform
              to learn, build, and engineer the future together.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="mailto:pratyumnis@bitmesra.ac.in">
                <Button className="gap-2.5 bg-white text-black hover:bg-[#D7E2EA] rounded-full px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer">
                  <Mail className="w-5 h-5" />
                  Contact Us
                </Button>
              </Link>
              <Link
                href="https://www.linkedin.com/company/robolution-bit-mesra"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="gap-2.5 border-white/20 bg-white/[0.04] text-[#D7E2EA] hover:bg-white/10 hover:border-white/40 hover:text-white rounded-full px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                >
                  <FaLinkedin className="w-5 h-5" />
                  Follow Us
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          10. NEWSLETTER SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="newsletter"
        className="relative z-20 py-24 sm:py-32 px-4 sm:px-8 md:px-12 overflow-hidden bg-transparent"
      >
        <div className="max-w-4xl mx-auto text-center relative">
          <FadeIn delay={0} y={25} className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-6">
              <span className="w-2 h-2 rounded-full bg-[#5227FF]" />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D7E2EA]/70">
                Community Updates
              </span>
            </div>
            <h2
              className="hero-heading font-black uppercase tracking-tight text-center leading-none mb-5"
              style={{ fontSize: 'clamp(2.4rem, 7.5vw, 95px)' }}
            >
              Stay in the Loop
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#D7E2EA]/60 max-w-xl mx-auto font-light leading-relaxed">
              Get updates on open workshops, competitions, robotics hackathons, and behind-the-scenes engineering.
            </p>
          </FadeIn>

          <FadeIn delay={0.15} y={25} className="max-w-2xl mx-auto">
            <form onSubmit={handleNewsletterSubmit}>
              <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="bg-white/5 border-white/10 text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 h-14 sm:h-16 text-base px-5 rounded-2xl focus-visible:ring-1 focus-visible:ring-white/30"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 sm:h-16 px-8 bg-white text-black hover:bg-[#D7E2EA] font-bold text-base shrink-0 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </div>

                {message && (
                  <m.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm mt-4 font-mono ${
                      message.type === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {message.text}
                  </m.p>
                )}

                <p className="text-[#D7E2EA]/40 flex items-center justify-center text-xs sm:text-sm mt-6 font-mono">
                  <LockIcon className="w-4 h-4 mr-2 shrink-0" /> We respect your privacy. Unsubscribe anytime.
                </p>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

export default HomeClient
