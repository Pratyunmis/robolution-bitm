'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ContactButtonProps {
  label?: string
  href?: string
  onClick?: () => void
  className?: string
}

export function ContactButton({
  label = 'Contact Us',
  href = '#contact',
  onClick,
  className = '',
}: ContactButtonProps) {
  const buttonContent = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full font-semibold uppercase tracking-widest bg-white text-black hover:bg-[#D7E2EA] cursor-pointer transition-all duration-300 px-8 py-3.5 sm:px-10 sm:py-4 text-xs sm:text-sm md:text-base shadow-[0_0_25px_rgba(255,255,255,0.2)] ${className}`}
    >
      <span className="relative z-10">{label}</span>
    </motion.button>
  )

  if (href) {
    return <Link href={href}>{buttonContent}</Link>
  }

  return buttonContent
}

export default ContactButton
