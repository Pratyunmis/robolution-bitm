'use client'

import React, { useRef, useEffect, useState } from 'react'

// Authentic Robolution BIT Mesra photos from gallery and archives
const row1Source = [
  '/gallery/Copy of DSC_0468.jpg',
  '/gallery/Copy of DSC_0475.jpg',
  '/gallery/Copy of DSC_0489.jpg',
  '/gallery/Copy of DSC_0569.jpg',
  '/gallery/Copy of DSC_0575.jpg',
  '/gallery/Copy of _MG_0001.jpg',
]

const row2Source = [
  '/gallery/Copy of _MG_0158.jpg',
  '/gallery/Copy of _MG_0202.jpg',
  '/gallery/Copy of _MG_0211.jpg',
  '/gallery/Copy of _MG_0215.jpg',
  '/gallery/Copy of _MG_0240.jpg',
  '/og-image.png',
]

// Tripled for seamless infinite horizontal scroll
const row1Images = [...row1Source, ...row1Source, ...row1Source, ...row1Source]
const row2Images = [...row2Source, ...row2Source, ...row2Source, ...row2Source]

export function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollOffset, setScrollOffset] = useState(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect()
            const sectionTop = window.scrollY + rect.top
            const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.25
            setScrollOffset(offset)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-transparent py-16 sm:py-24 overflow-hidden select-none"
    >
      {/* Side gradient fade masks for smooth transition */}
      <div className="absolute top-0 left-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-[#0C0C0C] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-[#0C0C0C] to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col gap-4 w-full">
        {/* Row 1: Moves RIGHT on scroll */}
        <div
          className="flex gap-4 w-max"
          style={{
            transform: `translate3d(${scrollOffset - 200}px, 0px, 0px)`,
            willChange: 'transform',
          }}
        >
          {row1Images.map((src, i) => (
            <div
              key={`row1-${i}`}
              className="w-[280px] sm:w-[360px] md:w-[420px] h-[180px] sm:h-[220px] md:h-[260px] min-w-[280px] sm:min-w-[360px] md:min-w-[420px] shrink-0 rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Robolution BIT Mesra Action ${i + 1}`}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Row 2: Moves LEFT on scroll (Authentic Robolution BIT Mesra Photos) */}
        <div
          className="flex gap-4 w-max"
          style={{
            transform: `translate3d(${-(scrollOffset - 200)}px, 0px, 0px)`,
            willChange: 'transform',
          }}
        >
          {row2Images.map((src, i) => (
            <div
              key={`row2-${i}`}
              className="w-[280px] sm:w-[360px] md:w-[420px] h-[180px] sm:h-[220px] md:h-[260px] min-w-[280px] sm:min-w-[360px] md:min-w-[420px] shrink-0 rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Robolution Robotics Project ${i + 1}`}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MarqueeSection
