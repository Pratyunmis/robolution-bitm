'use client'

import React from 'react'
import { FadeIn } from './FadeIn'
import { AnimatedText } from './AnimatedText'
import { ContactButton } from './ContactButton'
import { motion } from 'framer-motion'

const aboutText =
  "Founded in 2001, Robolution stands as the premier robotics and automation society of BIT Mesra, also known as Team Pratyumnis. We blend mechanical engineering, autonomous intelligence, and embedded systems to build world-class robots and empower the next generation of engineers. Let's build something incredible together!"

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full bg-transparent px-4 sm:px-8 md:px-12 py-24 sm:py-32 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ─── 4 Corner 3D Glass Robotics Floating Elements ─── */}
      {/* Top-Left: Glass Robot Core */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-4, 0, -4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[4%] sm:top-[6%] left-[2%] sm:left-[3%] md:left-[5%] z-10 w-[80px] sm:w-[120px] md:w-[150px] lg:w-[170px] pointer-events-none opacity-85 hover:opacity-100 transition-opacity"
      >
        <FadeIn delay={0.1} x={-50} y={0} duration={0.8}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/glass_icon_1.png"
            alt="Glass Robot Core"
            className="w-full h-auto object-contain select-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            loading="lazy"
            draggable={false}
          />
        </FadeIn>
      </motion.div>

      {/* Top-Right: Glass Quantum Processor */}
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [4, 0, 4] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-[4%] sm:top-[6%] right-[2%] sm:right-[3%] md:right-[5%] z-10 w-[80px] sm:w-[120px] md:w-[150px] lg:w-[170px] pointer-events-none opacity-85 hover:opacity-100 transition-opacity"
      >
        <FadeIn delay={0.15} x={50} y={0} duration={0.8}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/glass_icon_2.png"
            alt="Glass Quantum Processor"
            className="w-full h-auto object-contain select-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            loading="lazy"
            draggable={false}
          />
        </FadeIn>
      </motion.div>

      {/* Bottom-Left: Glass Bionic Arm */}
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [-3, 0, -3] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-[4%] sm:bottom-[6%] left-[2%] sm:left-[4%] md:left-[6%] z-10 w-[75px] sm:w-[110px] md:w-[140px] lg:w-[160px] pointer-events-none opacity-85 hover:opacity-100 transition-opacity"
      >
        <FadeIn delay={0.25} x={-50} y={0} duration={0.8}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/glass_icon_3.png"
            alt="Glass Bionic Arm"
            className="w-full h-auto object-contain select-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            loading="lazy"
            draggable={false}
          />
        </FadeIn>
      </motion.div>

      {/* Bottom-Right: Glass Planetary Gear */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [3, 0, 3] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-[4%] sm:bottom-[6%] right-[2%] sm:right-[4%] md:right-[6%] z-10 w-[80px] sm:w-[120px] md:w-[150px] lg:w-[170px] pointer-events-none opacity-85 hover:opacity-100 transition-opacity"
      >
        <FadeIn delay={0.3} x={50} y={0} duration={0.8}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/glass_icon_4.png"
            alt="Glass Planetary Gear"
            className="w-full h-auto object-contain select-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            loading="lazy"
            draggable={false}
          />
        </FadeIn>
      </motion.div>

      {/* ─── Center Content Container ─── */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto w-full">
        {/* Heading */}
        <FadeIn delay={0} y={30} duration={0.8} className="w-full">
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(2.8rem, 11vw, 150px)' }}
          >
            About Us
          </h2>
        </FadeIn>

        {/* Narrative Animated Text */}
        <div className="mt-8 sm:mt-12 md:mt-14 w-full flex justify-center px-4">
          <AnimatedText
            text={aboutText}
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[620px] text-base sm:text-lg md:text-xl"
          />
        </div>

        {/* CTA Button */}
        <div className="mt-14 sm:mt-20">
          <FadeIn delay={0.25} y={20} duration={0.8}>
            <ContactButton label="Contact Us" href="#newsletter" />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
