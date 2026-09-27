'use client'

import React, { useState } from 'react'
import MoltenMetal, { MoltenMetalProps } from './MoltenMetal'
import { Sparkles, Sliders, RefreshCw } from 'lucide-react'

const PRESETS = [
  {
    name: 'Robolution Cyber',
    props: {
      color1: '#3b82f6',
      color2: '#8b5cf6',
      color3: '#ec4899',
      speed: 0.3,
      scale: 3.8,
      detail: 3,
      glow: 1.6,
      swirl: 1.2,
      grainIntensity: 0.05,
      colorMode: 'molten',
    },
  },
  {
    name: 'Molten Flame',
    props: {
      color1: '#ff4500',
      color2: '#ff8c00',
      color3: '#ffff00',
      speed: 0.4,
      scale: 4.2,
      detail: 4,
      glow: 1.8,
      swirl: 1.5,
      grainIntensity: 0.04,
      colorMode: 'ember',
    },
  },
  {
    name: 'Frost Byte',
    props: {
      color1: '#00f2fe',
      color2: '#4facfe',
      color3: '#ffffff',
      speed: 0.25,
      scale: 3.5,
      detail: 3,
      glow: 1.5,
      swirl: 0.8,
      grainIntensity: 0.03,
      colorMode: 'frost',
    },
  },
  {
    name: 'Neon Toxic',
    props: {
      color1: '#00ff87',
      color2: '#60efff',
      color3: '#ffffff',
      speed: 0.35,
      scale: 4.0,
      detail: 3,
      glow: 1.7,
      swirl: 1.1,
      grainIntensity: 0.05,
      colorMode: 'molten',
    },
  },
]

export default function MoltenMetalShowcase() {
  const [activePreset, setActivePreset] = useState(0)
  const [customProps, setCustomProps] = useState<MoltenMetalProps>(PRESETS[0].props)
  const [showControls, setShowControls] = useState(false)

  const handlePresetChange = (index: number) => {
    setActivePreset(index)
    setCustomProps(PRESETS[index].props)
  }

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black my-12">
      {/* WebGL Canvas Background */}
      <MoltenMetal {...customProps} className="absolute inset-0 z-0" />

      {/* Content Overlay */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold tracking-wider text-white/80 uppercase">
              MoltenMetal Background Engine
            </span>
          </div>

          <button
            onClick={() => setShowControls(!showControls)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-full transition-all backdrop-blur-md border border-white/15"
          >
            <Sliders className="w-3.5 h-3.5" />
            {showControls ? 'Hide Controls' : 'Customize Shader'}
          </button>
        </div>

        {/* Floating Controls */}
        {showControls && (
          <div className="pointer-events-auto self-end bg-black/80 backdrop-blur-xl border border-white/15 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-white/70 font-semibold mb-2">
              <span>Shader Preset</span>
              <button
                onClick={() => setCustomProps(PRESETS[activePreset].props)}
                className="hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={p.name}
                  onClick={() => handlePresetChange(idx)}
                  className={`text-xs px-3 py-2 rounded-xl border transition-all ${
                    activePreset === idx
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="text-white/60 block mb-1">Speed ({customProps.speed})</label>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={customProps.speed ?? 0.35}
                  onChange={(e) =>
                    setCustomProps({ ...customProps, speed: parseFloat(e.target.value) })
                  }
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <label className="text-white/60 block mb-1">Scale ({customProps.scale})</label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.2"
                  value={customProps.scale ?? 4}
                  onChange={(e) =>
                    setCustomProps({ ...customProps, scale: parseFloat(e.target.value) })
                  }
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <label className="text-white/60 block mb-1">Swirl ({customProps.swirl})</label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={customProps.swirl ?? 1}
                  onChange={(e) =>
                    setCustomProps({ ...customProps, swirl: parseFloat(e.target.value) })
                  }
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="max-w-lg bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 pointer-events-auto">
          <h3 className="text-2xl font-bold text-white mb-2">Interactive Fluid WebGL</h3>
          <p className="text-sm text-white/70 leading-relaxed">
            Move your cursor across this container to interact with the high-performance OGL
            fragment shader. Pure GPU-accelerated math creating organic fluid metal dynamics.
          </p>
        </div>
      </div>
    </div>
  )
}
