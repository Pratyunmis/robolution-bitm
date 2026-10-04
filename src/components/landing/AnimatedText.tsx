'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
}

interface WordProps {
  word: string
  progress: MotionValue<number>
  range: [number, number]
}

function Word({ word, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.22, 1])

  return (
    <span className="relative inline-block mr-[0.32em] mb-1">
      <span className="opacity-0 select-none">{word}</span>
      <motion.span style={{ opacity }} className="absolute inset-0 select-text">
        {word}
      </motion.span>
    </span>
  )
}

export function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.35'],
  })

  const words = text.split(' ')
  const totalWords = words.length

  return (
    <p ref={containerRef} className={`flex flex-wrap justify-center ${className}`}>
      {words.map((word, i) => {
        const start = i / totalWords
        const end = Math.min(1, start + 1 / totalWords)
        return (
          <Word
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
          />
        )
      })}
    </p>
  )
}

export default AnimatedText
