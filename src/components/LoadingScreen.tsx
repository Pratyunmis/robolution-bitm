'use client'

import React, { useEffect, useState } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'

// ─── Scanning line ────────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <m.div
      className="absolute left-0 right-0 h-px pointer-events-none z-10"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
        boxShadow: '0 0 20px rgba(255,255,255,0.3)',
      }}
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
    />
  )
}

// ─── Corner brackets ──────────────────────────────────────────────────────────
function CornerBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const posClass = { tl: 'top-8 left-8', tr: 'top-8 right-8', bl: 'bottom-8 left-8', br: 'bottom-8 right-8' }[position]
  const rotClass = { tl: 'rotate-0', tr: 'rotate-90', bl: '-rotate-90', br: 'rotate-180' }[position]
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`absolute ${posClass} ${rotClass} w-10 h-10`}
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-white/40" />
      <div className="absolute top-0 left-0 h-full w-[2px] bg-white/40" />
    </m.div>
  )
}

// ─── Glitch text ──────────────────────────────────────────────────────────────
function GlitchText({ text, className }: { text: string; className?: string }) {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 120)
    }, 2800 + Math.random() * 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative select-none ${className}`}>
      <span className="relative z-10">{text}</span>
      {glitch && (
        <>
          <span className="absolute inset-0 z-0" style={{ color: '#ff0040', clipPath: 'polygon(0 30%, 100% 30%, 100% 50%, 0 50%)', transform: 'translate(-3px, 0)', opacity: 0.8 }}>{text}</span>
          <span className="absolute inset-0 z-0" style={{ color: '#00ffff', clipPath: 'polygon(0 55%, 100% 55%, 100% 75%, 0 75%)', transform: 'translate(3px, 0)', opacity: 0.8 }}>{text}</span>
        </>
      )}
    </div>
  )
}

// ─── Loading bar ──────────────────────────────────────────────────────────────
function LoadingBar({ progress }: { progress: number }) {
  return (
    <div className="relative w-full h-[2px] bg-white/10">
      <m.div
        className="absolute top-0 left-0 h-full"
        style={{
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.9))',
          boxShadow: '0 0 12px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.4)',
        }}
      />
      <m.div
        className="absolute top-1/2 w-2 h-2 rounded-full bg-white"
        style={{
          left: `${progress * 100}%`,
          boxShadow: '0 0 10px rgba(255,255,255,1), 0 0 25px rgba(255,255,255,0.6)',
          transform: 'translateX(-50%) translateY(-50%)',
        }}
      />
    </div>
  )
}

// ─── Floating particles ───────────────────────────────────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 2,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <m.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: 0.15 }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ─── Main Loading Screen ──────────────────────────────────────────────────────
interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('INITIALIZING SYSTEMS')
  const [done, setDone] = useState(false)

  const statuses = [
    'INITIALIZING SYSTEMS',
    'CALIBRATING SENSORS',
    'LOADING FLIGHT DATA',
    'SYNCHRONIZING MOTORS',
    'ENGAGING PROPELLERS',
    'SYSTEMS NOMINAL',
    'READY FOR TAKEOFF',
  ]

  useEffect(() => {
    let p = 0
    let statusIdx = 0
    const interval = setInterval(() => {
      const increment = p < 0.3 ? 0.018 : p < 0.7 ? 0.008 : p < 0.9 ? 0.014 : 0.025
      p = Math.min(p + increment, 1)
      setProgress(p)

      const newIdx = Math.floor(p * (statuses.length - 0.01))
      if (newIdx !== statusIdx) {
        statusIdx = newIdx
        setStatusText(statuses[newIdx])
      }

      if (p >= 1) {
        clearInterval(interval)
        setTimeout(() => {
          setDone(true)
          setTimeout(onComplete, 900)
        }, 400)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <m.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Grid bg */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />

          <FloatingParticles />
          <ScanLine />
          <CornerBracket position="tl" />
          <CornerBracket position="tr" />
          <CornerBracket position="bl" />
          <CornerBracket position="br" />

          {/* Top label */}
          <m.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="absolute top-10 left-1/2 -translate-x-1/2">
            <span className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-mono">Team Pratyunmis • BIT Mesra</span>
          </m.div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-6 w-full max-w-xl text-center">

            {/* Logo / icon */}
            <m.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <m.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center"
              >
                <m.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/30" />
                </m.div>
              </m.div>
              {/* Pulse ring */}
              <m.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border border-white/20"
              />
            </m.div>

            {/* Title */}
            <m.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <GlitchText text="ROBOLUTION" className="text-5xl sm:text-7xl font-black tracking-tighter text-white" />
              <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-[10px] uppercase tracking-[0.5em] text-white/30 mt-2 font-mono">
                Official Robotics Club • Est. 2001
              </m.p>
            </m.div>

            {/* Progress bar */}
            <m.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="w-full">
              <LoadingBar progress={progress} />
            </m.div>

            {/* Status + percentage */}
            <div className="w-full flex items-center justify-between">
              <m.span key={statusText} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">
                {statusText}
              </m.span>
              <span className="text-[11px] font-mono text-white/60 tabular-nums">
                {Math.round(progress * 100).toString().padStart(3, '0')}%
              </span>
            </div>

            {/* Blinking cursor */}
            <m.div className="w-full flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              <span className="text-[10px] font-mono text-white/20">›</span>
              <m.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-[10px] font-mono text-white/30">█</m.span>
            </m.div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
