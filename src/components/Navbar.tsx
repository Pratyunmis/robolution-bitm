'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/AuthContext'

// Define nav items
const navItems = [
  { name: 'Home', link: '/' },
  { name: 'About', link: '/about' },
  { name: 'Team', link: '/team' },
  { name: 'Events', link: '/events' },
  { name: 'Gallery', link: '/gallery' },
  { name: 'Updates', link: '/announcements' },
  { name: 'Contact', link: '/contact' },
]

export const Navbar = () => {
  const pathname = usePathname()
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  // Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        // Always show at top
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setIsVisible(false)
        setMobileMenuOpen(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <>
      {/* Desktop & Mobile Floating Navbar */}
      <motion.div
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none"
      >
        <nav
          className={cn(
            'w-full max-w-6xl flex items-center justify-between p-2 sm:p-2.5 md:p-2 rounded-full border border-white/15',
            'bg-black/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] pointer-events-auto',
            'transition-all duration-300 hover:border-white/25',
          )}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={handleNavClick}
            className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer shrink-0 group"
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
              <Image
                className="object-contain group-hover:scale-110 transition-transform duration-300"
                alt="ROBOLUTION LOGO"
                height={32}
                width={32}
                src="/logo.png"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white text-sm sm:text-base tracking-wider leading-none">
                ROBOLUTION
              </span>
              <span className="text-[9px] font-mono tracking-widest text-cyan-400/80 leading-tight">
                BIT MESRA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 pr-2">
            {navItems.map((item) => {
              const isActive = pathname === item.link
              return (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={handleNavClick}
                  className={cn(
                    'relative px-3.5 py-1.5 text-xs lg:text-sm font-medium transition-colors rounded-full duration-200',
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/5',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-white/15 border border-white/20 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              )
            })}

            {/* Auth / Admin CTA */}
            <div className="ml-2 pl-3 border-l border-white/15 flex items-center gap-2">
              {(user?.role === 'admin' || user?.role === 'member') && (
                <Link
                  href="/admin"
                  className="px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider uppercase text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-400 rounded-full transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Dashboard</span>
                </Link>
              )}
              {!user ? (
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-xs lg:text-sm font-bold text-black bg-white hover:bg-cyan-100 rounded-full transition-all duration-200 shadow-md shadow-white/10 hover:scale-105 active:scale-95"
                >
                  Sign In
                </Link>
              ) : (
                <Link
                  href="/profile"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:border-cyan-400 transition-all overflow-hidden"
                  title={user.email}
                >
                  <span className="text-white text-xs font-bold uppercase">
                    {user.email ? user.email.charAt(0) : 'U'}
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-all duration-200 active:scale-95"
            aria-label="Toggle navigation menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </nav>
      </motion.div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/85 flex flex-col justify-between pt-24 pb-10 px-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-2 max-w-sm mx-auto w-full">
              {navItems.map((item, index) => {
                const isActive = pathname === item.link
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link
                      href={item.link}
                      onClick={handleNavClick}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 rounded-2xl text-lg font-bold transition-all',
                        isActive
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'text-white/70 hover:text-white hover:bg-white/5',
                      )}
                    >
                      <span>{item.name}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-40" />
                    </Link>
                  </motion.div>
                )
              })}

              {/* Mobile Auth Button */}
              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2">
                {!user ? (
                  <Link
                    href="/login"
                    onClick={handleNavClick}
                    className="w-full text-center py-3 bg-white text-black font-bold rounded-2xl text-base shadow-lg"
                  >
                    Sign In
                  </Link>
                ) : (
                  <Link
                    href="/profile"
                    onClick={handleNavClick}
                    className="w-full text-center py-3 bg-white/10 text-white border border-white/20 font-bold rounded-2xl text-base"
                  >
                    My Account ({user.email})
                  </Link>
                )}
              </div>
            </div>

            <div className="text-center font-mono text-xs text-white/40">
              ROBOLUTION • BIT MESRA // EST. 2001
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
