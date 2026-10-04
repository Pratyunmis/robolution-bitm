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
      className={`relative inline-flex items-center justify-center rounded-full font-medium uppercase tracking-widest text-white cursor-pointer transition-shadow duration-300 px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base ${className}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
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
