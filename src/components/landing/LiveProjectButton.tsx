'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface LiveProjectButtonProps {
  label?: string
  href?: string
  onClick?: () => void
  className?: string
}

export function LiveProjectButton({
  label = 'Live Project',
  href = '#',
  onClick,
  className = '',
}: LiveProjectButtonProps) {
  const buttonContent = (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors duration-200 cursor-pointer ${className}`}
    >
      <span>{label}</span>
    </motion.button>
  )

  if (href && href !== '#') {
    return (
      <Link href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {buttonContent}
      </Link>
    )
  }

  return buttonContent
}

export default LiveProjectButton
