'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import Link from 'next/link'
import CountUp from '@/components/CountUp'
import { motion as m, useScroll, useTransform, useSpring } from 'framer-motion'
import { SponsorsSection } from '@/components/SponsorsSection'
import { GalleryPreview } from '@/components/GalleryPreview'
import MoltenMetal from '@/components/MoltenMetal'

const stats = [
  { label: 'Audience Reach', value: 5000, icon: Users },
  { label: 'Industry Partners', value: 50, icon: Zap },
  { label: 'Workshops', value: 20, icon: Code2 },
  { label: 'Team Members', value: 100, icon: Trophy },
]

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

// ─── Particle Field ───────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`
        ctx.fill()
      })

      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
}

function GridBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs uppercase tracking-[0.4em] text-white/40 font-semibold border border-white/10 px-4 py-2 rounded-full inline-block mb-6">
      {children}
    </span>
  )
}

function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ filter: 'blur(100px)' }}
    />
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const HomeClient: React.FC<HomeClientProps> = ({ sponsors, galleryImages }) => {
  const [email, setEmail] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0])
  const heroY = useTransform(scrollY, [0, 500], [0, 80])
  const springHeroY = useSpring(heroY, { stiffness: 100, damping: 30 })

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
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <MoltenMetal
          color1="#5227FF"
          color2="#FF9FFC"
          color3="#FFFFFF"
          speed={0.35}
          scale={4}
          detail={3}
          glow={1.3}
          coreSize={0.12}
          swirl={1}
          fold={-0.2}
          blackPoint={0.14}
          brightness={1.3}
          colorMode="molten"
          grain={true}
          grainIntensity={0.04}
          mouseInteraction={true}
          mouseStrength={0.3}
          opacity={1.0}
        />
      </div>
      <ParticleField />
      <GridBackground />
      <div className="fixed inset-0 z-0 pointer-events-none bg-radial-[ellipse_at_center] from-white/[0.03] to-transparent" />

      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
      >
        <GlowOrb className="w-[700px] h-[400px] bg-white/[0.04] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <GlowOrb className="w-[300px] h-[300px] bg-blue-500/[0.05] top-1/4 right-1/4" />

        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />

        <m.div
          style={{ opacity: heroOpacity, y: springHeroY }}
          className="flex flex-col items-center"
        >
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs md:text-sm uppercase tracking-[0.4em] mb-8 text-white/40 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            Est. 2001 • BIT Mesra
          </m.p>

          <div className="overflow-hidden mb-4">
            <m.h1
              initial={{ y: '120%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="text-[clamp(3rem,12vw,9rem)] font-black tracking-tighter leading-none"
              style={{
                background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.5) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ROBOLUTION
            </m.h1>
          </div>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-base md:text-xl text-white/40 mb-10 font-light max-w-xl leading-relaxed"
          >
            Pioneering Innovation.{' '}
            <span className="text-white/25">Redefining Robotics.</span>
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Link href="/about">
              <Button className="group rounded-full px-7 py-5 text-sm md:text-base font-semibold bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                Explore More
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="rounded-full bg-transparent px-7 py-5 text-sm md:text-base font-semibold border-white/20 text-white hover:bg-white/5 hover:border-white/40 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
              >
                Contact Us
              </Button>
            </Link>
          </m.div>
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/25">Scroll</span>
          <m.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}>
            <ChevronDown className="w-4 h-4 text-white/25" />
          </m.div>
        </m.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ABOUT SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-32 px-4">
        <GlowOrb className="w-[400px] h-[400px] bg-white/[0.04] -top-20 -left-20" />
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <SectionLabel>Our Story</SectionLabel>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.05] tracking-tight">
                A Legacy of<br />
                <span style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Excellence.
                </span>
              </h2>
              <div className="space-y-5 text-base md:text-lg text-white/50 leading-relaxed">
                <p>
                  Founded in 2001, <strong className="text-white/80">Robolution</strong> stands as a center of innovation and teamwork, blending mechanics, electronics, and programming.
                </p>
                <p>
                  We proudly represent BIT Mesra as <strong className="text-white/80">Team Pratyunmis</strong> at ABU ROBOCON — arguably the most prestigious international robotics contest. In 2021, we made history by earning a perfect score of 100 in 3D design analysis.
                </p>
              </div>
              <div className="mt-10">
                <Link href="/about">
                  <Button variant="ghost" className="text-white/60 hover:text-white px-0 gap-2 group">
                    Read our full story
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative bg-white/[0.03] border border-white/[0.08] p-6 md:p-8 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-all duration-500">
                    <stat.icon className="w-6 h-6 mb-5 text-white/30 group-hover:text-white/60 transition-colors" />
                    <div className="text-3xl md:text-4xl font-black mb-1 flex items-end gap-0.5">
                      <CountUp from={0} to={stat.value} direction="up" duration={0.5} delay={0.1} startWhen={true} className="count-up-text" />
                      <PlusIcon className="w-5 h-5 mb-1 text-white/40" />
                    </div>
                    <div className="text-xs text-white/40 uppercase tracking-widest font-medium">{stat.label}</div>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WHAT WE DO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <SectionLabel>What We Do</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Built for<br />
              <span className="text-white/30">Builders.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Code2, title: 'Workshops & Training', desc: 'Regular hands-on sessions on mechanics, electronics, and coding to skill up students from scratch.', tag: 'Learning' },
              { icon: Trophy, title: 'RoboSaga', desc: 'Our flagship 3-day annual techno-management fest featuring hackathons, exhibitions, and robot wars.', tag: 'Competition' },
              { icon: Cpu, title: 'Projects & Research', desc: 'Building industry-grade robots, participating in ABU ROBOCON, and pioneering new tech solutions.', tag: 'Innovation' },
            ].map((item, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl" />
                <div className="relative bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 h-full backdrop-blur-sm hover:border-white/20 transition-all duration-500 overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] uppercase tracking-widest text-white/20 border border-white/10 px-2 py-1 rounded-full">{item.tag}</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                    <item.icon className="w-5 h-5 text-white/60" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ACHIEVEMENTS
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-32 px-4">
        <GlowOrb className="w-[500px] h-[500px] bg-white/[0.03] top-1/2 right-0 -translate-y-1/2" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <SectionLabel>Hall of Fame</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Our Victories.<br />
              <span className="text-white/30">Our Legacy.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Trophy, year: 'Robocon 2013', title: 'Best Rookie Team', desc: 'Recognized as the best newcomer team in our first year of participation at ABU Robocon' },
              { icon: Award, year: 'Robocon 2015', title: '₹50,000 Award by MathWorks', desc: 'Won the prestigious prize for best use of MathWorks tools in robot development' },
              { icon: Medal, year: 'Robocon 2015', title: 'Best Non-Quarterfinalist', desc: 'Awarded for exceptional performance and innovation among non-quarterfinalist teams' },
              { icon: Star, year: 'Techfest IIT Bombay 2015', title: '2nd Prize in Pixelate', desc: "Secured second place in Pixelate, an image processing robotics event at IIT Bombay's Techfest" },
            ].map((item, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
                <div className="flex gap-6">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-white/10 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <div className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-2">{item.year}</div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SINCE 2001
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-40 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-white/[0.03] to-black pointer-events-none" />
        <GlowOrb className="w-[600px] h-[600px] bg-white/[0.06] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto text-center relative">
          <SectionLabel>Proudly Established</SectionLabel>
          <m.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-[100px] sm:text-[180px] md:text-[260px] font-black tracking-tighter leading-none mb-12"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            2001
          </m.h2>
          <p className="text-xl md:text-3xl text-white/60 font-light mb-4 max-w-3xl mx-auto">
            Over <span className="font-bold text-white">two decades</span> of pioneering innovation in robotics
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16">
            {[{ val: '24+', label: 'Years' }, { val: '1000+', label: 'Students Trained' }, { val: '50+', label: 'Competitions Won' }, { val: '∞', label: 'Innovation' }].map((s, i) => (
              <m.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
                <div className="text-3xl md:text-5xl font-black text-white mb-2">{s.val}</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">{s.label}</div>
              </m.div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mt-8">
            {[{ year: '2001', title: 'Foundation', desc: "Robolution was established as BIT Mesra's official robotics club" }, { year: '2021', title: 'Perfect Score', desc: 'Achieved 100/100 in 3D design analysis at ABU ROBOCON' }, { year: '2025', title: 'Future Forward', desc: 'Continuing to push boundaries in robotics and innovation' }].map((item, i) => (
              <m.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] rounded-3xl p-8 text-left hover:border-white/20 transition-all">
                <div className="text-3xl font-black text-white/60 mb-2">{item.year}</div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {sponsors.length > 0 && <SponsorsSection sponsors={sponsors} />}
      {galleryImages.length > 0 && <GalleryPreview images={galleryImages} />}

      {/* ══════════════════════════════════════════════════════════════
          JOIN CTA
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-40 px-4 overflow-hidden">
        <GlowOrb className="w-[500px] h-[300px] bg-white/[0.05] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center relative">
          <SectionLabel>Get Involved</SectionLabel>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Join the<br />Revolution.</h2>
          <p className="text-lg md:text-xl text-white/40 mb-12 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re a curious beginner or a seasoned pro, Robolution offers a platform to learn, build, and innovate together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="mailto:pratyumnis@bitmesra.ac.in">
              <Button className="gap-3 bg-white text-black hover:bg-white/90 rounded-full px-9 py-6 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                <Mail className="w-4 h-4" /> Contact Us
              </Button>
            </Link>
            <Link href="https://www.linkedin.com/company/robolution-bit-mesra">
              <Button variant="outline" className="gap-3 border-white/20 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:border-white/40 rounded-full px-9 py-6 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm">
                <FaLinkedin className="w-4 h-4" /> Follow Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════════════════════════ */}
      <section id="newsletter" className="relative z-10 py-32 px-4 border-t border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <SectionLabel>Newsletter</SectionLabel>
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Stay in the Loop</h2>
          <p className="text-white/40 mb-10 leading-relaxed">
            Get exclusive updates on workshops, competitions, and behind-the-scenes content from Robolution.
          </p>
          <form onSubmit={handleNewsletterSubmit}>
            <div className="bg-white/[0.04] border border-white/[0.10] rounded-3xl p-6 md:p-10 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus-visible:ring-white/20 focus-visible:border-white/30 h-13 text-sm px-5 rounded-xl disabled:opacity-50"
                />
                <Button type="submit" disabled={isSubmitting} className="h-13 px-7 bg-white text-black hover:bg-white/90 font-bold shrink-0 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100">
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
              {message && (
                <m.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`text-sm mt-4 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {message.text}
                </m.p>
              )}
              <p className="text-white/30 flex items-center justify-center text-xs mt-5">
                <LockIcon className="w-3.5 h-3.5 mr-2 shrink-0" /> We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </form>
          <div className="mt-8 flex items-center justify-center gap-8 flex-wrap">
            {[['500+', 'Subscribers'], ['Weekly', 'Updates'], ['100%', 'Free']].map(([val, label], i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="h-6 w-px bg-white/10" />}
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{val}</div>
                  <div className="text-xs text-white/30 uppercase tracking-wider">{label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomeClient
