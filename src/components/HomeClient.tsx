'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import DarkVeil from '@/components/DarkVeil'
import {
  Users,
  Trophy,
  Zap,
  Code2,
  Cpu,
  Mail,
  PlusIcon,
  Send,
  LockIcon,
  Award,
  Medal,
  Star,
} from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import Link from 'next/link'
import CountUp from '@/components/CountUp'
import { m } from 'framer-motion'
import { SponsorsSection } from '@/components/SponsorsSection'
import { GalleryPreview } from '@/components/GalleryPreview'

const stats = [
  { label: 'Audience Reach', value: 5000, icon: Users },
  { label: 'Industry Partners', value: 50, icon: Zap },
  { label: 'Workshops', value: 20, icon: Code2 },
  { label: 'Team Members', value: 100, icon: Trophy },
]

interface Sponsor {
  id: string
  name: string
  logo: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
  website?: string
  description?: string
  active: boolean
  order: number
}

interface GalleryImage {
  id: string
  title: string
  image: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
  category?: string
}

interface HomeClientProps {
  sponsors: Sponsor[]
  galleryImages: GalleryImage[]
}

const HomeClient: React.FC<HomeClientProps> = ({ sponsors, galleryImages }) => {
  const [email, setEmail] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  )

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Successfully subscribed to our newsletter!' })
        setEmail('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to subscribe. Please try again.' })
      }
    } catch (_error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-x-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center p-4 pt-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-white/5 blur-[120px] rounded-full -z-10" />

        <p className="text-xs md:text-base uppercase tracking-[0.2em] md:tracking-[0.3em] mb-6 text-white/50 border border-white/10 px-3 md:px-4 py-2 rounded-full backdrop-blur-sm">
          Est. 2001 • BIT Mesra
        </p>

        <div className="overflow-hidden mb-4">
          <m.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ ease: 'linear', duration: 0.3 }}
            className="text-5xl sm:text-6xl md:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white via-white to-white/40 pb-2 px-4"
          >
            ROBOLUTION
          </m.h1>
        </div>

        <p className="text-lg sm:text-xl md:text-3xl text-white/70 mb-10 font-light max-w-3xl leading-relaxed px-4">
          Pioneering Innovation. Redefining Robotics.
          <span className="block text-sm md:text-lg text-white/40 mt-2 font-normal">
            The Official Robotics Club of BIT Mesra
          </span>
        </p>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4">
          <Link href="/about">
            <Button className="rounded-full px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold bg-white text-black hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-white/20">
              About Us
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              className="rounded-full bg-transparent px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                A Legacy of <br />
                <span className="text-white/50">Excellence and Innovation.</span>
              </h2>
              <div className="space-y-6 text-lg text-white/60 leading-relaxed">
                <p>
                  Founded in 2001, <strong>Robolution</strong> stands as a center of innovation and
                  teamwork, blending mechanics, electronics, and programming. We nurture a spirit of
                  innovation that turns concepts into real-world creations.
                </p>
                <p>
                  We proudly represent BIT Mesra as <strong>Team Pratyunmis</strong> at ABU ROBOCON,
                  arguably the most prestigious international robotics contest. In 2021, we made
                  history by earning a perfect score of 100 in 3D design analysis.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors group"
                >
                  <stat.icon className="w-8 h-8 mb-4 text-white/50 group-hover:text-white transition-colors" />
                  <div className="text-3xl font-bold mb-1 flex items-center">
                    <CountUp
                      from={0}
                      to={stat.value}
                      // separator=","
                      direction="up"
                      duration={0.5}
                      delay={0.1}
                      startWhen={true}
                      className="count-up-text"
                    />
                    <PlusIcon className="font-bold h-7 w-7" />
                  </div>
                  <div className="text-sm text-white/50 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="relative z-10 py-32 px-4 bg-black/50 backdrop-blur-lg border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What We Do</h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Fostering technical skills and innovation through hands-on learning and competition.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
              <div className="relative bg-black/40 border border-white/10 p-8 rounded-3xl h-full backdrop-blur-md">
                <Code2 className="w-10 h-10 mb-6 text-white" />
                <h3 className="text-2xl font-bold mb-3">Workshops &amp; Training</h3>
                <p className="text-white/60">
                  Regular hands-on sessions on mechanics, electronics, and coding to skill up
                  students from scratch.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
              <div className="relative bg-black/40 border border-white/10 p-8 rounded-3xl h-full backdrop-blur-md">
                <Trophy className="w-10 h-10 mb-6 text-white" />
                <h3 className="text-2xl font-bold mb-3">RoboSaga</h3>
                <p className="text-white/60">
                  Our flagship 3-day annual techno-management fest featuring hackathons,
                  exhibitions, and robot wars.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
              <div className="relative bg-black/40 border border-white/10 p-8 rounded-3xl h-full backdrop-blur-md">
                <Cpu className="w-10 h-10 mb-6 text-white" />
                <h3 className="text-2xl font-bold mb-3">Projects &amp; Research</h3>
                <p className="text-white/60">
                  Building industry-grade robots, participating in ABU ROBOCON, and pioneering new
                  tech solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="relative z-10 py-32 px-4 bg-black/50 backdrop-blur-lg border-y border-white/5">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 blur-[150px] rounded-full" />

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/50 font-semibold border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                Our Achievements
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-linear-to-b from-white via-white to-white/40">
                Hall of Fame
              </span>
            </h2>
            <p className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto">
              Proudly representing BIT Mesra at national and international robotics competitions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Achievement 1 */}
            <div className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-all" />
              <div className="relative flex gap-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-white/20 group-hover:scale-110 transition-transform">
                    <Trophy className="w-8 h-8 text-black" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-2">
                    Robocon 2013
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    Best Rookie Team
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Recognized as the best newcomer team in our first year of participation at ABU
                    Robocon
                  </p>
                </div>
              </div>
            </div>

            {/* Achievement 2 */}
            <div className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-all" />
              <div className="relative flex gap-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-white/20 group-hover:scale-110 transition-transform">
                    <Award className="w-8 h-8 text-black" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-2">
                    Robocon 2015
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    ₹50,000 Award by MathWorks
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Won the prestigious prize for best use of MathWorks tools in robot development
                  </p>
                </div>
              </div>
            </div>

            {/* Achievement 3 */}
            <div className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-all" />
              <div className="relative flex gap-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-white/20 group-hover:scale-110 transition-transform">
                    <Medal className="w-8 h-8 text-black" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-2">
                    Robocon 2015
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    Best Non-Quarterfinalist Team
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Awarded for exceptional performance and innovation among non-quarterfinalist
                    teams
                  </p>
                </div>
              </div>
            </div>

            {/* Achievement 4 */}
            <div className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-all" />
              <div className="relative flex gap-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-white/20 group-hover:scale-110 transition-transform">
                    <Star className="w-8 h-8 text-black" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-2">
                    Techfest IIT Bombay 2015
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    2nd Prize in Pixelate
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    Secured second place in Pixelate, an image processing robotics event at IIT
                    Bombay&apos;s Techfest
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Since 2001 Legacy Section - EXPANDED */}
      <section className="relative z-10 py-40 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-black via-white/5 to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-white/10 blur-[150px] rounded-full" />

        <div className="max-w-7xl mx-auto text-center relative">
          {/* Main Year Display */}
          <div className="mb-16">
            <div className="inline-block mb-8">
              <p className="text-sm md:text-base uppercase tracking-[0.5em] text-white/50 mb-2 font-semibold">
                Proudly Established
              </p>
              <div className="h-px w-32 mx-auto bg-linear-to-r from-transparent via-white/30 to-transparent" />
            </div>

            <div className="relative inline-block mb-12">
              <div className="absolute inset-0 bg-white/20 blur-[120px] animate-pulse" />
              <h2 className="relative text-[140px] md:text-[280px] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-linear-to-b from-white via-white to-white/20 drop-shadow-2xl">
                2001
              </h2>
            </div>

            <p className="text-2xl md:text-4xl text-white font-light mb-6 max-w-4xl mx-auto leading-relaxed">
              Over <span className="font-bold text-white">two decades</span> of pioneering
              innovation in robotics
            </p>
            <p className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto">
              From humble beginnings to becoming one of India&apos;s premier robotics clubs,
              we&apos;ve been at the forefront of technological advancement.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105">
              <div className="text-3xl md:text-6xl font-black text-white mb-3">24+</div>
              <div className="text-sm text-white/60 uppercase tracking-wider font-semibold">
                Years of Excellence
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105">
              <div className="text-3xl md:text-6xl font-black text-white mb-3">1000+</div>
              <div className="text-sm text-white/60 uppercase tracking-wider font-semibold">
                Students Trained
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105">
              <div className="text-3xl md:text-6xl font-black text-white mb-3">50+</div>
              <div className="text-sm text-white/60 uppercase tracking-wider font-semibold">
                Competitions Won
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105">
              <div className="text-3xl md:text-6xl font-black text-white mb-3">∞</div>
              <div className="text-sm text-white/60 uppercase tracking-wider font-semibold">
                Innovation
              </div>
            </div>
          </div>

          {/* Timeline Highlights */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 text-left backdrop-blur-md">
              <div className="text-4xl font-bold text-white/90 mb-3">2001</div>
              <h4 className="text-xl font-bold text-white mb-2">Foundation</h4>
              <p className="text-white/60">
                Robolution was established as BIT Mesra&apos;s official robotics club
              </p>
            </div>
            <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 text-left backdrop-blur-md">
              <div className="text-4xl font-bold text-white/90 mb-3">2021</div>
              <h4 className="text-xl font-bold text-white mb-2">Perfect Score</h4>
              <p className="text-white/60">Achieved 100/100 in 3D design analysis at ABU ROBOCON</p>
            </div>
            <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 text-left backdrop-blur-md">
              <div className="text-4xl font-bold text-white/90 mb-3">2025</div>
              <h4 className="text-xl font-bold text-white mb-2">Future Forward</h4>
              <p className="text-white/60">
                Continuing to push boundaries in robotics and innovation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      {sponsors.length > 0 && <SponsorsSection sponsors={sponsors} />}

      {/* Gallery Preview Section */}
      {galleryImages.length > 0 && <GalleryPreview images={galleryImages} />}

      {/* Join the Revolution CTA */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">Join the Revolution</h2>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Whether you&apos;re a curious beginner or a seasoned pro, Robolution offers a platform
            to learn, build, and innovate together.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="mailto:pratyumnis@bitmesra.ac.in">
              <Button className="gap-3 bg-linear-to-r from-white to-gray-200 text-black shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30 rounded-full px-10 py-7 text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95">
                <Mail className="w-5 h-5" />
                Contact Us
              </Button>
            </Link>
            <Link href="https://www.linkedin.com/company/robolution-bit-mesra">
              <Button
                variant="outline"
                className="gap-3 border-white/30 bg-white/5 text-white shadow-md shadow-white/5 hover:bg-white/10 hover:border-white/50 hover:shadow-lg hover:shadow-white/10 rounded-full px-10 py-7 text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
              >
                <FaLinkedin className="w-5 h-5" />
                Follow Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section - GRAND & SEPARATE */}
      <section
        id="newsletter"
        className="relative z-10 py-32 px-4 overflow-hidden border-y border-white/10"
      >
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 blur-[120px] rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative px-4">
          <div className="mb-12">
            <div className="inline-block mb-6">
              <span className="text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/50 font-semibold">
                Newsletter
              </span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black mb-6 leading-tight px-4">
              Stay in the Loop
            </h2>
            <p className="text-base md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed px-4">
              Get exclusive updates on workshops, competitions, tech talks, and behind-the-scenes
              content from Robolution. Join our community of innovators.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleNewsletterSubmit}>
              <div className="bg-white/5 border border-white/20 rounded-3xl p-6 md:p-12 backdrop-blur-xl">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:border-white/40 h-14 md:h-16 text-base md:text-lg px-4 md:px-6 rounded-2xl disabled:opacity-50"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 md:h-16 px-8 md:px-10 bg-white text-black hover:bg-gray-100 font-bold text-base md:text-lg shrink-0 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </div>

                {message && (
                  <m.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm mt-4 ${
                      message.type === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {message.text}
                  </m.p>
                )}

                <p className="text-white/40 flex items-center justify-center md:justify-start text-xs md:text-sm mt-6">
                  <LockIcon className="w-4 h-4 md:w-5 md:h-5 mr-2 shrink-0" /> We respect your
                  privacy. Unsubscribe anytime.
                </p>
              </div>
            </form>

            {/* Social Proof */}
            <div className="mt-10 flex items-center justify-center gap-6 md:gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-white">500+</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Subscribers</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-white">Weekly</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Updates</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Free</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomeClient
