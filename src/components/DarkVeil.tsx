'use client'

import React from 'react'
import MoltenMetal, { MoltenMetalProps } from './MoltenMetal'

export interface DarkVeilProps extends MoltenMetalProps {
  hueShift?: number
  noiseIntensity?: number
  scanlineIntensity?: number
  speed?: number
  scanlineFrequency?: number
  warpAmount?: number
  resolutionScale?: number
}

export default function DarkVeil({
  color1 = '#5227FF',
  color2 = '#FF9FFC',
  color3 = '#FFFFFF',
  speed = 0.35,
  scale = 4,
  detail = 3,
  glow = 1.3,
  coreSize = 0.12,
  swirl = 1,
  fold = -0.2,
  blackPoint = 0.14,
  brightness = 1.3,
  colorMode = 'molten',
  grain = false,
  grainIntensity = 0.0,
  mouseInteraction = true,
  mouseStrength = 0.3,
  opacity = 1.0,
  backgroundColor = '#FFFFFF',
  lightMode = false,
  className = '',
  ...rest
}: DarkVeilProps) {
  return (
    <MoltenMetal
      color1={color1}
      color2={color2}
      color3={color3}
      speed={speed}
      scale={scale}
      detail={detail}
      glow={glow}
      coreSize={coreSize}
      swirl={swirl}
      fold={fold}
      blackPoint={blackPoint}
      brightness={brightness}
      colorMode={colorMode}
      grain={grain}
      grainIntensity={grainIntensity}
      mouseInteraction={mouseInteraction}
      mouseStrength={mouseStrength}
      opacity={opacity}
      backgroundColor={backgroundColor}
      lightMode={lightMode}
      className={className}
    />
  )
}
