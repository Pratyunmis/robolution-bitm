'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FastForward, Zap } from 'lucide-react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  vRot: number
  alpha: number
  targetX?: number
  targetY?: number
  isLetterPiece?: boolean
}

export function RobotCollisionLoader() {
  const [isVisible, setIsVisible] = useState(true)
  const [phase, setPhase] = useState<'charging' | 'colliding' | 'forming' | 'revealed'>('charging')
  const [showLogo, setShowLogo] = useState(false)
  const [shake, setShake] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])

  // Skip / dismiss intro
  const handleSkip = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    // Only run on client
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const centerX = width / 2
    const centerY = height / 2

    // Colors matching the two combat robots
    const shardColors = [
      '#00f0ff', // electric cyan
      '#38bdf8', // sky blue
      '#ff3b30', // hazard red
      '#ff8a00', // molten orange
      '#facc15', // titanium gold
      '#e2e8f0', // chrome silver
      '#94a3b8', // dark steel
      '#ffffff', // spark white
    ]

    // Create 120 explosion shards that will later reform the letters
    const createExplosionShards = () => {
      const shards: Particle[] = []

      // Targets: approximate bounding line for the word "ROBOLUTION"
      const letterCount = 10
      const wordWidth = Math.min(width * 0.8, 800)
      const letterSpacing = wordWidth / letterCount
      const startX = centerX - wordWidth / 2 + letterSpacing / 2

      for (let i = 0; i < 140; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 18 + 5
        const targetLetterIdx = i % letterCount
        const targetX = startX + targetLetterIdx * letterSpacing + (Math.random() - 0.5) * 40
        const targetY = centerY + (Math.random() - 0.5) * 50

        shards.push({
          x: centerX + (Math.random() - 0.5) * 40,
          y: centerY + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 8 + 4,
          color: shardColors[Math.floor(Math.random() * shardColors.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.4,
          alpha: 1,
          targetX,
          targetY,
          isLetterPiece: true,
        })
      }
      return shards
    }

    // Timeline control
    const timer1 = setTimeout(() => {
      // 0.85s: IMPACT COLLISION
      setPhase('colliding')
      setShake(true)
      particlesRef.current = createExplosionShards()

      setTimeout(() => setShake(false), 300)
    }, 850)

    const timer2 = setTimeout(() => {
      // 1.5s: MAGNETIC REASSEMBLY / FORMING WORDMARK
      setPhase('forming')
      setShowLogo(true)
    }, 1500)

    const timer3 = setTimeout(() => {
      // 2.7s: REVEAL COMPLETE WORDMARK WITH GLOW
      setPhase('revealed')
    }, 2700)

    const timer4 = setTimeout(() => {
      // 3.5s: SMOOTH DISMISSAL
      setIsVisible(false)
    }, 3500)

    // Canvas render loop for spark & shard physics
    let lastTime = performance.now()

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      ctx.clearRect(0, 0, width, height)

      const shards = particlesRef.current

      if (shards.length > 0) {
        for (let i = 0; i < shards.length; i++) {
          const p = shards[i]

          if (phase === 'colliding') {
            // Explosive dispersal with air drag
            p.x += p.vx
            p.y += p.vy
            p.vx *= 0.94
            p.vy *= 0.94
            p.rotation += p.vRot
          } else if (phase === 'forming' || phase === 'revealed') {
            // Magnetic attraction towards the center "ROBOLUTION" wordmark
            if (p.targetX !== undefined && p.targetY !== undefined) {
              const dx = p.targetX - p.x
              const dy = p.targetY - p.y
              p.vx = p.vx * 0.85 + dx * 0.12
              p.vy = p.vy * 0.85 + dy * 0.12
              p.x += p.vx
              p.y += p.vy
              p.rotation += p.vRot * 0.5

              // Draw energy magnetic connection line when close
              const dist = Math.hypot(dx, dy)
              if (dist < 120 && Math.random() > 0.7) {
                ctx.save()
                ctx.strokeStyle = '#00f0ff'
                ctx.lineWidth = 1
                ctx.globalAlpha = 0.35
                ctx.beginPath()
                ctx.moveTo(p.x, p.y)
                ctx.lineTo(p.targetX, p.targetY)
                ctx.stroke()
                ctx.restore()
              }
            }
          }

          // Draw metallic fragment shard
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.fillStyle = p.color
          ctx.shadowColor = p.color
          ctx.shadowBlur = 8

          // Draw angular polygon shard
          ctx.beginPath()
          ctx.moveTo(-p.size, -p.size / 2)
          ctx.lineTo(p.size, -p.size)
          ctx.lineTo(p.size / 2, p.size)
          ctx.lineTo(-p.size / 2, p.size / 2)
          ctx.closePath()
          ctx.fill()
          ctx.restore()
        }
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      window.removeEventListener('resize', handleResize)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [phase])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={`fixed inset-0 z-[9999] bg-black select-none overflow-hidden flex items-center justify-center ${
            shake ? 'translate-x-1 -translate-y-1' : ''
          }`}
          style={{
            animation: shake ? 'shake 0.25s cubic-bezier(.36,.07,.19,.97) both' : 'none',
          }}
        >
          {/* Cyberpunk Ground Grid Perspective */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 80%)',
              transform: 'perspective(500px) rotateX(60deg) translateY(120px)',
            }}
          />

          {/* Ambient Arena Glows */}
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-red-600/15 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 blur-[140px] rounded-full pointer-events-none" />

          {/* Physics Particle Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-white/5 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white transition-all cursor-pointer backdrop-blur-md"
          >
            <span>Skip Intro</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>

          {/* PHASE 1: THE CHARGING COMBAT ROBOTS */}
          {phase === 'charging' && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Speed Lines */}
              <div className="absolute inset-0 flex flex-col justify-around opacity-30 pointer-events-none">
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse delay-75" />
              </div>

              {/* LEFT ROBOT: "RED TITAN" (Drum Spinner Charging Right) */}
              <motion.div
                initial={{ x: '-120vw', scale: 0.9 }}
                animate={{ x: '-40px', scale: 1.15 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="absolute z-10 flex items-center"
              >
                {/* Jet / Spark Exhaust Trail */}
                <div className="w-48 h-8 bg-gradient-to-l from-red-500/80 via-orange-500/40 to-transparent blur-md mr-[-10px]" />

                {/* Left Combat Robot SVG */}
                <svg className="w-48 h-32 drop-shadow-[0_0_25px_rgba(239,68,68,0.7)]" viewBox="0 0 200 130">
                  {/* Wheel Pods */}
                  <rect x="20" y="10" width="45" height="24" rx="6" fill="#18181b" stroke="#71717a" strokeWidth="2" />
                  <rect x="20" y="96" width="45" height="24" rx="6" fill="#18181b" stroke="#71717a" strokeWidth="2" />
                  {/* Yellow Tread Accents */}
                  <line x1="28" y1="10" x2="28" y2="34" stroke="#f5c518" strokeWidth="3" />
                  <line x1="42" y1="10" x2="42" y2="34" stroke="#f5c518" strokeWidth="3" />
                  <line x1="28" y1="96" x2="28" y2="120" stroke="#f5c518" strokeWidth="3" />
                  <line x1="42" y1="96" x2="42" y2="120" stroke="#f5c518" strokeWidth="3" />

                  {/* Armored Wedge Body */}
                  <polygon points="35,30 140,42 165,65 140,88 35,100 15,65" fill="#09090b" stroke="#ef4444" strokeWidth="3" />
                  {/* Red Hazard Stripe */}
                  <polygon points="50,45 125,52 140,65 125,78 50,85" fill="#dc2626" />
                  <polygon points="65,50 115,55 125,65 115,75 65,80" fill="#991b1b" />

                  {/* Aggressive Headlight Glow */}
                  <circle cx="120" cy="55" r="4" fill="#ffffff" />
                  <circle cx="120" cy="75" r="4" fill="#ffffff" />

                  {/* Spinning Drum Impactor at Front */}
                  <circle cx="170" cy="65" r="22" fill="#27272a" stroke="#ffffff" strokeWidth="2" />
                  <polygon points="170,43 190,65 170,87 150,65" fill="#ffffff" />
                  <circle cx="170" cy="65" r="8" fill="#ef4444" />
                </svg>
              </motion.div>

              {/* RIGHT ROBOT: "CYAN STRATOS" (Disc Spinner Charging Left) */}
              <motion.div
                initial={{ x: '120vw', scale: 0.9 }}
                animate={{ x: '40px', scale: 1.15 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="absolute z-10 flex items-center flex-row-reverse"
              >
                {/* Jet / Cyan Exhaust Trail */}
                <div className="w-48 h-8 bg-gradient-to-r from-cyan-400/80 via-blue-500/40 to-transparent blur-md ml-[-10px]" />

                {/* Right Combat Robot SVG */}
                <svg className="w-48 h-32 drop-shadow-[0_0_25px_rgba(6,182,212,0.7)]" viewBox="0 0 200 130">
                  {/* Wheel Pods */}
                  <rect x="135" y="10" width="45" height="24" rx="6" fill="#18181b" stroke="#71717a" strokeWidth="2" />
                  <rect x="135" y="96" width="45" height="24" rx="6" fill="#18181b" stroke="#71717a" strokeWidth="2" />
                  {/* Yellow Tread Accents */}
                  <line x1="145" y1="10" x2="145" y2="34" stroke="#f5c518" strokeWidth="3" />
                  <line x1="160" y1="10" x2="160" y2="34" stroke="#f5c518" strokeWidth="3" />
                  <line x1="145" y1="96" x2="145" y2="120" stroke="#f5c518" strokeWidth="3" />
                  <line x1="160" y1="96" x2="160" y2="120" stroke="#f5c518" strokeWidth="3" />

                  {/* Armored Wedge Body */}
                  <polygon points="165,30 60,42 35,65 60,88 165,100 185,65" fill="#09090b" stroke="#00f0ff" strokeWidth="3" />
                  {/* Cyan Tech Panels */}
                  <polygon points="150,45 75,52 60,65 75,78 150,85" fill="#0891b2" />
                  <polygon points="135,50 85,55 75,65 85,75 135,80" fill="#0e7490" />

                  {/* Cyan Eye Beacon */}
                  <circle cx="80" cy="55" r="4" fill="#00f0ff" />
                  <circle cx="80" cy="75" r="4" fill="#00f0ff" />

                  {/* Dual Disc Kinetic Striker at Front */}
                  <circle cx="30" cy="65" r="22" fill="#27272a" stroke="#ffffff" strokeWidth="2" />
                  <polygon points="30,43 10,65 30,87 50,65" fill="#ffffff" />
                  <circle cx="30" cy="65" r="8" fill="#00f0ff" />
                </svg>
              </motion.div>
            </div>
          )}

          {/* PHASE 2: IMPACT FLASH & SHOCKWAVE */}
          {phase === 'colliding' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
              {/* Blinding White Flash */}
              <motion.div
                initial={{ opacity: 1, scale: 0.2 }}
                animate={{ opacity: 0, scale: 2.5 }}
                transition={{ duration: 0.4 }}
                className="w-96 h-96 rounded-full bg-white blur-xl"
              />

              {/* Shockwave Rings */}
              <motion.div
                initial={{ scale: 0.1, opacity: 1, borderWidth: 12 }}
                animate={{ scale: 4, opacity: 0, borderWidth: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute w-64 h-64 rounded-full border-cyan-400"
              />
              <motion.div
                initial={{ scale: 0.1, opacity: 1, borderWidth: 8 }}
                animate={{ scale: 3.2, opacity: 0, borderWidth: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
                className="absolute w-64 h-64 rounded-full border-red-500"
              />
            </div>
          )}

          {/* PHASE 3 & 4: MAGNETIC FUSION INTO "ROBOLUTION" */}
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-30 text-center px-4"
            >
              {/* Central Energy Orb Behind Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 bg-cyan-500/20 blur-[90px] rounded-full pointer-events-none animate-pulse" />

              {/* Tagline Badge */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.3em] font-mono text-cyan-400 border border-cyan-500/30 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <Zap className="w-3.5 h-3.5 fill-cyan-400" />
                <span>BIT Mesra • Team Pratyumnis</span>
              </motion.div>

              {/* The Grand "ROBOLUTION" Wordmark */}
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ letterSpacing: '0.4em', y: '40%' }}
                  animate={{ letterSpacing: '0.08em', y: '0%' }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl sm:text-7xl md:text-9xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-b from-white via-cyan-100 to-cyan-500 drop-shadow-[0_0_40px_rgba(0,240,255,0.7)]"
                >
                  ROBOLUTION
                </motion.h1>
              </div>

              {/* Sub-label */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-xs sm:text-sm md:text-base font-mono uppercase tracking-[0.4em] text-white/60 mt-4"
              >
                Pioneering Innovation • Redefining Robotics
              </motion.p>
            </motion.div>
          )}

          {/* Bottom Loading Progress Bar */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-1 bg-white/10 rounded-full overflow-hidden z-30">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.2, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-red-500 via-orange-400 to-cyan-400"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
