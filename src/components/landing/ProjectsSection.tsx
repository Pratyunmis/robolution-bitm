'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeIn } from './FadeIn'
import { LiveProjectButton } from './LiveProjectButton'

interface ProjectItem {
  number: string
  title: string
  category: string
  col1Img1: string
  col1Img2: string
  col2Img: string
  link?: string
}

const projects: ProjectItem[] = [
  {
    number: '01',
    title: 'Titan Robocon Mech',
    category: 'ABU Robocon Flagship',
    col1Img1: '/gallery/Copy of DSC_0468.jpg',
    col1Img2: '/gallery/Copy of _MG_0215.jpg',
    col2Img: '/Main Bot.png',
    link: '#about',
  },
  {
    number: '02',
    title: 'Aegis Combat Spinner',
    category: 'Combat Robotics 15kg',
    col1Img1: '/gallery/Copy of DSC_0575.jpg',
    col1Img2: '/gallery/Copy of DSC_0475.jpg',
    col2Img: '/bot 2.png',
    link: '#about',
  },
  {
    number: '03',
    title: 'Vanguard Rover V1',
    category: 'Autonomous Mobile Robotics',
    col1Img1: '/gallery/Copy of _MG_0158.jpg',
    col1Img2: '/gallery/Copy of DSC_0569.jpg',
    col2Img: '/bot 1.png',
    link: '#about',
  },
]

interface CardProps {
  project: ProjectItem
  index: number
  totalCards: number
}

function ProjectCard({ project, index, totalCards }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  })

  const targetScale = 1 - (totalCards - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])

  return (
    <div
      ref={cardRef}
      className="h-[85vh] sticky top-24 md:top-32 flex items-start justify-center"
      style={{
        top: `calc(5.5rem + ${index * 28}px)`,
      }}
    >
      <motion.div
        style={{ scale }}
        className="w-full max-w-6xl rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Top Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 md:mb-8 pb-4 border-b border-[#D7E2EA]/15">
          <div className="flex items-center gap-4 sm:gap-6">
            <span
              className="font-black text-[#D7E2EA] leading-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              {project.number}
            </span>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/50 block font-light">
                {project.category}
              </span>
              <h3
                className="font-medium uppercase text-[#D7E2EA] leading-tight"
                style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)' }}
              >
                {project.title}
              </h3>
            </div>
          </div>

          <LiveProjectButton label="Live Project" href={project.link || '#'} />
        </div>

        {/* Bottom Row: 2-column image grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
          {/* Left Column (40% width on desktop) */}
          <div className="md:col-span-5 flex flex-col gap-4 sm:gap-6">
            <div
              className="w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-white/5 border border-white/10"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.col1Img1}
                alt={`${project.title} Hardware Preview 1`}
                className="w-full h-full object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px]"
                loading="lazy"
              />
            </div>
            <div
              className="w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-white/5 border border-white/10"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.col1Img2}
                alt={`${project.title} Hardware Preview 2`}
                className="w-full h-full object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px]"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column (60% width on desktop) */}
          <div className="md:col-span-7 flex justify-center items-center">
            <div className="w-full h-full min-h-[280px] md:min-h-[420px] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-gradient-to-b from-white/[0.04] to-black/30 border border-white/10 flex items-center justify-center p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.col2Img}
                alt={`${project.title} Bot Profile`}
                className="w-full h-full max-h-[380px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative z-30 w-full bg-transparent rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-32"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Heading */}
        <FadeIn delay={0} y={40} duration={0.8} className="w-full text-center mb-16 sm:mb-20 md:mb-24">
          <h2
            className="hero-heading font-black uppercase tracking-tight text-center leading-none"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Project
          </h2>
        </FadeIn>

        {/* 3 Sticky Cards Container */}
        <div className="relative w-full flex flex-col gap-12 sm:gap-16">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.number}
              project={project}
              index={index}
              totalCards={projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
