'use client'

import React from 'react'
import Link from 'next/link'
import { FadeIn } from './FadeIn'
import { Magnet } from './Magnet'
import { ContactButton } from './ContactButton'
import { Bot, Sparkles, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-between overflow-x-clip bg-transparent pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10 px-4 sm:px-6 md:px-10">
      {/* ─── Top Origin Badge ─── */}
      <div className="w-full flex justify-center items-center z-10">
        <FadeIn delay={0.1} y={-15} duration={0.8}>
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-mono text-cyan-300 font-semibold">
              Est. 2001 • BIT Mesra • Team Pratyumnis
            </span>
          </div>
        </FadeIn>
      </div>

      {/* ─── Hero Heading (Precise Responsive Typography - No Overflow) ─── */}
      <div className="w-full overflow-visible flex flex-col justify-center items-center select-none z-10 my-auto py-2">
        <FadeIn delay={0.2} y={30} duration={0.9} className="w-full max-w-full px-2">
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-none text-center select-none w-full mx-auto"
            style={{
              fontSize: 'clamp(2.4rem, 10.2vw, 130px)',
              letterSpacing: '-0.03em',
            }}
          >
            ROBOLUTION
          </h1>
        </FadeIn>

        <FadeIn delay={0.3} y={20} duration={0.8} className="text-center mt-2 sm:mt-3">
          <p className="text-xs sm:text-sm md:text-base text-[#D7E2EA]/60 uppercase tracking-[0.2em] font-medium">
            Pioneering Innovation • Redefining Robotics
          </p>
        </FadeIn>
      </div>

      {/* ─── Hero 3D Bot with Magnet Effect ─── */}
      <FadeIn
        delay={0.5}
        y={30}
        duration={0.9}
        className="absolute left-1/2 -translate-x-1/2 z-20 w-[240px] sm:w-[320px] md:w-[380px] lg:w-[460px] top-[48%] sm:top-auto sm:bottom-4 -translate-y-1/2 sm:translate-y-0 pointer-events-auto"
      >
        <Magnet
          padding={140}
          strength={2.5}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
          className="w-full flex items-end justify-center relative"
        >
          {/* Ambient Glow Aura */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[260px] sm:w-[340px] h-[260px] sm:h-[340px] bg-cyan-500/20 blur-[90px] rounded-full pointer-events-none" />

          {/* Bot Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Main Bot.png"
            alt="Robolution Titan 3D Bot"
            className="w-full h-auto object-contain max-h-[50vh] sm:max-h-[62vh] md:max-h-[70vh] select-none pointer-events-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] relative z-10"
            loading="eager"
            draggable={false}
          />
        </Magnet>
      </FadeIn>

      {/* ─── Bottom Action Bar ─── */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 z-30 pt-4 px-2 sm:px-4 md:px-6">
        <FadeIn delay={0.4} y={20} duration={0.8} className="text-center sm:text-left">
          <p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[280px] sm:max-w-[260px] md:max-w-[300px]"
            style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1.1rem)' }}
          >
            The Official Robotics Club of BIT Mesra • Engineering the Next Generation of Mechatronics
          </p>
        </FadeIn>

        <FadeIn delay={0.6} y={20} duration={0.8} className="flex items-center gap-3">
          <ContactButton label="Explore Fleet" href="#projects" />
        </FadeIn>
      </div>
    </section>
  )
}

export default HeroSection
