'use client'

import React from 'react'
import { FadeIn } from './FadeIn'
import { Hero3DCadModel } from './Hero3DCadModel'

export function HeroSection() {
  return (
    <section className="relative min-h-[95vh] sm:min-h-screen w-full flex flex-col items-center justify-between overflow-hidden bg-transparent pt-24 sm:pt-28 pb-12 px-4 select-none">
      {/* ─── 3D Hologram Bot CAD (Rotating Behind ROBOLUTION Typography) ─── */}
      <div className="absolute inset-0 z-0 w-full h-full flex items-center justify-center pointer-events-auto">
        <Hero3DCadModel />
      </div>

      {/* ─── Top Spacer for perfect vertical centering ─── */}
      <div className="w-full shrink-0 h-4 sm:h-8" />

      {/* ─── Hero Content Overlay (Master Typography Hierarchy with 3D Bot Backdrop) ─── */}
      <div className="relative z-10 w-full max-w-7xl px-2 sm:px-6 flex flex-col items-center justify-center text-center pointer-events-none my-auto overflow-visible">
        {/* Origin Badge */}
        <FadeIn delay={0.1} y={15} duration={0.8}>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-xl mb-4 sm:mb-6 pointer-events-auto shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            <span className="text-xs sm:text-sm font-medium tracking-[0.22em] uppercase text-[#D7E2EA]/90 font-mono">
              Est. 2001 • Team Pratyumnis • BIT Mesra
            </span>
          </div>
        </FadeIn>

        {/* Hero Title (Titanium Metallic Sheen) */}
        <FadeIn delay={0.2} y={25} duration={0.9} className="w-full overflow-visible flex items-center justify-center">
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-none text-center select-none mx-auto whitespace-nowrap overflow-visible"
            style={{
              fontSize: 'clamp(2.1rem, 9.2vw, 132px)',
              letterSpacing: '-0.03em',
            }}
          >
            ROBOLUTION
          </h1>
        </FadeIn>

        {/* Tagline & Subheading */}
        <FadeIn delay={0.3} y={20} duration={0.85}>
          <div className="mt-4 sm:mt-6 max-w-2xl mx-auto space-y-1.5">
            <p className="hero-subheading-gradient text-lg sm:text-2xl md:text-3xl font-medium tracking-tight">
              Pioneering Innovation. Redefining Robotics.
            </p>
            <p className="text-xs sm:text-base text-[#D7E2EA]/60 font-normal tracking-wide">
              The Official Robotics & Innovation Club of BIT Mesra
            </p>
          </div>
        </FadeIn>

        {/* Call to Actions */}
        <FadeIn delay={0.4} y={15} duration={0.8}>
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
            <a
              href="#about"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm sm:text-base hover:bg-[#D7E2EA] transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.25)] group"
            >
              Explore Club
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a
              href="mailto:pratyumnis@bitmesra.ac.in"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/20 bg-white/[0.04] text-[#D7E2EA] font-medium text-sm sm:text-base backdrop-blur-md hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            >
              Contact Team
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export default HeroSection
