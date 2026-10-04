'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
}

interface CharProps {
  char: string
  progress: MotionValue<number>
  range: [number, number]
}

function Character({ char, progress, range }: CharProps) {
  const opacity = useTransform(progress, range, [0.2, 1])

  return (
    <span className="relative inline-block">
      <span className="opacity-0 select-none">{char === ' ' ? '\u00A0' : char}</span>
      <motion.span style={{ opacity }} className="absolute inset-0 select-text">
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  )
}

export function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  const words = text.split(' ')
  let charCounter = 0
  const totalChars = text.length

  return (
    <p ref={containerRef} className={`flex flex-wrap justify-center ${className}`}>
      {words.map((word, wordIdx) => {
        const wordChars = word.split('')
        return (
          <span key={wordIdx} className="inline-flex whitespace-nowrap">
            {wordChars.map((char, charIdx) => {
              const start = charCounter / totalChars
              charCounter += 1
              const end = charCounter / totalChars

              return (
                <Character
                  key={charIdx}
                  char={char}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              )
            })}
            {wordIdx < words.length - 1 && (
              (() => {
                const start = charCounter / totalChars
                charCounter += 1
                const end = charCounter / totalChars
                return (
                  <Character
                    char=" "
                    progress={scrollYProgress}
                    range={[start, end]}
                  />
                )
              })()
            )}
          </span>
        )
      })}
    </p>
  )
}

export default AnimatedText
