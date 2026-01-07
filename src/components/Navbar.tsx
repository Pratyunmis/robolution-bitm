'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  // No need for useEffect to set activeTab, we'll derive it from pathname directly

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
        setMobileMenuOpen(false) // Close mobile menu when hiding
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
      {/* Desktop & Mobile Navbar */}
      <motion.div
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4"
      >
        <nav
          className={cn(
            'w-full max-w-7xl flex items-center justify-between p-3 md:p-1 rounded-full border border-white/20',
            'bg-white/10 backdrop-blur-md shadow-lg shadow-black/5',
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={handleNavClick}
            className="flex items-center gap-2 px-3 py-2 cursor-pointer shrink-0"
          >
            <Image
              className="object-cover "
              alt="ROBOLUTION LOGO"
              height={32}
              width={32}
              src="/logo.png"
            />
            <span className="font-bold text-white text-sm md:text-base tracking-wide">
              ROBOLUTION
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.link
              return (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={handleNavClick}
                  className="relative px-4 py-2 text-sm font-medium text-white transition-colors hover:text-white/80"
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white/20 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-all duration-200 active:scale-95"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </nav>
      </motion.div>

      {/* Mobile Menu Overlay & Content */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              style={{ willChange: 'opacity' }}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-24 left-4 right-4 z-50 md:hidden backdrop-blur-2xl"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="bg-linear-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex flex-col gap-1 p-3">
                  {navItems.map((item) => {
                    const isActive = pathname === item.link
                    return (
                      <Link
                        key={item.name}
                        href={item.link}
                        onClick={handleNavClick}
                        className={cn(
                          'relative px-6 py-4 text-base font-semibold rounded-2xl transition-all duration-150',
                          'active:scale-[0.98]',
                          isActive
                            ? 'bg-white/25 text-white shadow-lg shadow-white/10'
                            : 'text-white/80 hover:text-white hover:bg-white/10',
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="mobile-active"
                            className="absolute inset-0 bg-white/20 rounded-2xl"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center justify-between">
                          {item.name}
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className="w-2 h-2 rounded-full bg-white"
                            />
                          )}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
