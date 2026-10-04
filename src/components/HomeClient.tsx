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
  ArrowUpRight,
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
      {/* ─── Fixed DarkVeil Dynamic Canvas ─── */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      {/* 1. HERO SECTION */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      {/* 2. MARQUEE SECTION */}
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
      <section id="achievements" className="relative z-20 py-28 sm:py-36 px-4 sm:px-8 md:px-12 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
            <FadeIn delay={0} y={-10}>
              <span className="text-xs uppercase tracking-[0.4em] text-[#D7E2EA]/40 font-semibold border border-white/10 px-4 py-2 rounded-full inline-block mb-6">
                Hall of Fame
              </span>
            </FadeIn>

            <FadeIn delay={0.1} y={30} className="w-full">
              <h2
                className="hero-heading font-black uppercase tracking-tight text-center leading-none"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
              >
                Victories &amp; Legacy
              </h2>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                icon: Trophy,
                year: 'Robocon 2013',
                title: 'Best Rookie Team',
                desc: 'Recognized as the best newcomer team in our first year of participation at ABU Robocon.',
              },
              {
                icon: Award,
                year: 'Robocon 2015',
                title: '₹50,000 Award by MathWorks',
                desc: 'Won the prestigious prize for best use of MathWorks tools in robot development and simulation.',
              },
              {
                icon: Medal,
                year: 'Robocon 2015',
                title: 'Best Non-Quarterfinalist',
                desc: 'Awarded for exceptional mechanism design and innovation among non-quarterfinalist teams.',
              },
              {
                icon: Star,
                year: 'Techfest IIT Bombay 2015',
                title: '2nd Prize in Pixelate',
                desc: "Secured second place in Pixelate, an image processing robotics competition at IIT Bombay's Techfest.",
              },
            ].map((item, i) => (
              <FadeIn
                key={i}
                delay={i * 0.1}
                x={i % 2 === 0 ? -20 : 20}
                className="group relative bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 sm:p-8 hover:border-white/20 hover:bg-white/[0.06] backdrop-blur-xl transition-all duration-300 overflow-hidden"
              >
                <div className="flex gap-6 items-start">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-white/10 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-7 h-7 text-[#0C0C0C]" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[#D7E2EA]/40 font-semibold mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-[#D7E2EA] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[#D7E2EA]/60 font-light leading-relaxed text-sm md:text-base">
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
          6. STATS & TIMELINE
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 py-28 sm:py-36 px-4 sm:px-8 md:px-12 bg-transparent">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn delay={0} y={30} className="mb-20">
            <span className="text-xs uppercase tracking-[0.4em] text-[#D7E2EA]/40 font-semibold border border-white/10 px-4 py-2 rounded-full inline-block mb-6">
              Our Track Record
            </span>
            <h2
              className="hero-heading font-black uppercase tracking-tight text-center leading-none"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
            >
              24+ Years of Innovation
            </h2>
          </FadeIn>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {[
              { label: 'Audience Reach', value: 5000, icon: Users },
              { label: 'Industry Partners', value: 50, icon: Zap },
              { label: 'Workshops', value: 20, icon: Code2 },
              { label: 'Team Members', value: 100, icon: Trophy },
            ].map((stat, i) => (
              <FadeIn
                key={i}
                delay={i * 0.1}
                y={30}
                className="bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 rounded-3xl text-left backdrop-blur-md hover:border-white/20 transition-colors"
              >
                <stat.icon className="w-8 h-8 mb-4 text-[#D7E2EA]/60" />
                <div className="text-3xl sm:text-5xl font-black text-[#D7E2EA] mb-2 flex items-center">
                  <CountUp from={0} to={stat.value} duration={1} delay={0.2} startWhen={true} />
                  <span>+</span>
                </div>
                <div className="text-xs uppercase tracking-wider text-[#D7E2EA]/50 font-semibold">
                  {stat.label}
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Timeline Highlights */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                year: '2001',
                title: 'Foundation',
                desc: 'Robolution was established as BIT Mesra’s official robotics club.',
              },
              {
                year: '2021',
                title: 'Perfect Score',
                desc: 'Achieved 100/100 in 3D design analysis at ABU ROBOCON.',
              },
              {
                year: '2025',
                title: 'Future Forward',
                desc: 'Continuing to push boundaries in autonomous robotics and AI.',
              },
            ].map((item, i) => (
              <FadeIn
                key={i}
                delay={i * 0.15}
                y={30}
                className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 text-left backdrop-blur-md hover:border-white/20 transition-all"
              >
                <div className="text-4xl font-black text-[#D7E2EA] mb-3">{item.year}</div>
                <h4 className="text-xl font-bold uppercase tracking-tight text-[#D7E2EA] mb-2">
                  {item.title}
                </h4>
                <p className="text-[#D7E2EA]/60 font-light leading-relaxed text-sm">
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
      <section className="relative z-20 py-32 px-4 sm:px-8 md:px-12 bg-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn delay={0} y={30}>
            <h2
              className="hero-heading font-black uppercase tracking-tight text-center leading-none mb-8"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 90px)' }}
            >
              Join the Revolution
            </h2>
            <p className="text-lg md:text-2xl text-[#D7E2EA]/70 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Whether you&apos;re a curious beginner or a seasoned pro, Robolution offers a platform
              to learn, build, and innovate together.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="mailto:pratyumnis@bitmesra.ac.in">
                <Button className="gap-3 bg-[#D7E2EA] text-[#0C0C0C] hover:bg-white rounded-full px-10 py-7 text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-white/10 cursor-pointer">
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
                  className="gap-3 border-white/20 bg-white/5 text-[#D7E2EA] hover:bg-white/10 hover:border-white/40 rounded-full px-10 py-7 text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm cursor-pointer"
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
        className="relative z-20 py-32 px-4 sm:px-8 md:px-12 overflow-hidden bg-transparent"
      >
        <div className="max-w-4xl mx-auto text-center relative">
          <FadeIn delay={0} y={30} className="mb-12">
            <span className="text-xs uppercase tracking-[0.4em] text-[#D7E2EA]/40 font-semibold border border-white/10 px-4 py-2 rounded-full inline-block mb-6">
              Newsletter
            </span>
            <h2
              className="hero-heading font-black uppercase tracking-tight text-center leading-none mb-6"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 90px)' }}
            >
              Stay in the Loop
            </h2>
            <p className="text-base md:text-xl text-[#D7E2EA]/60 max-w-2xl mx-auto font-light leading-relaxed">
              Get exclusive updates on workshops, competitions, tech talks, and behind-the-scenes
              content from Robolution.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} y={30} className="max-w-2xl mx-auto">
            <form onSubmit={handleNewsletterSubmit}>
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
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
                    className="h-14 sm:h-16 px-8 bg-[#D7E2EA] text-[#0C0C0C] hover:bg-white font-bold text-base shrink-0 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-white/10 cursor-pointer"
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

                <p className="text-[#D7E2EA]/40 flex items-center justify-center text-xs sm:text-sm mt-6">
                  <LockIcon className="w-4 h-4 mr-2 shrink-0" /> We respect your privacy.
                  Unsubscribe anytime.
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
